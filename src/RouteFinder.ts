import {RouteFinderStatus} from "./RouteFinderStatus";
import {RouteFinderErrorMessage} from "./RouteFinderErrorMessage";
import {ChildProcess} from 'child_process';
import {createInterface} from 'readline';
import {RouteFinderProcessFactory} from "./process/RouteFinderProcessFactory";
import {RouteFinderParser} from "./parser/RouteFinderParser";
import {Destination, Hop} from "./interfaces";

export class RouteFinder{
    hostname: string;
    status: RouteFinderStatus;
    private childProcess: ChildProcess | null = null;
    private parser: RouteFinderParser;
    private processFactory: RouteFinderProcessFactory;
    private onHopCallback: ((hop: Hop) => void )| null = null;
    private onFindDestinationIPCallback: ((destination: Destination) => void) | null = null;
    private onDestinationCallback: ((destination: Destination) => void) | null = null;
    private onErrorCallback: ((err: Error) => void) | null = null;
    private onCloseCallback: ((msg: string) => void) | null = null;
    private onRawMessageCallback: ((msg: string) => void) | null = null;
    private destination: Destination | null = null;


    constructor(hostname: string, parser: RouteFinderParser, processFactory: RouteFinderProcessFactory) {
        this.hostname = hostname;
        this.status = RouteFinderStatus.BeforeStart;
        this.parser = parser;
        this.processFactory = processFactory;
    }

    start(){
        if(this.status !== RouteFinderStatus.BeforeStart){
            throw new Error(RouteFinderErrorMessage.AlreadyStarted);
        }
        try {
            this.childProcess = this.processFactory.createProcess(this.hostname);
            this.status = RouteFinderStatus.Start;
            this.setOnClose(this.childProcess);
            this.setOnReadLineAtStdout(this.childProcess);
            this.setOnReadLineAtStderr(this.childProcess);
            this.setOnError(this.childProcess);
            this.setOnRawMessage(this.childProcess);
        } catch (e) {
            this.status = RouteFinderStatus.BeforeStart;
            throw new Error(RouteFinderErrorMessage.NotCreatedFinder);
        }
        return this;
    }

    public onHop(cb: (hop: Hop) => void){
        this.onHopCallback = cb;
        return this;
    }

    public onDestination(cb: (destination: Destination) => void){
        this.onDestinationCallback = cb;
        return this;
    }

    public onFindDestinationIP(cb: (destination: Destination) => void){
        this.onFindDestinationIPCallback = cb;
        return this;
    }

    public onError(cb: (error: Error) => void){
        this.onErrorCallback = cb;
        return this;
    }

    public onClose(cb: (msg: string) => void){
        this.onCloseCallback = cb;
        return this;
    }

    public onRawMessage(cb: (msg: string) => void){
        this.onRawMessageCallback = cb;
        return this;
    }

    private setOnClose(childProcess : ChildProcess){
        childProcess.on('close', ((code: string) => {
            this.end();
            if(this.onCloseCallback != null){
                this.onCloseCallback(code);
            }
        }))
        return this;
    }

    private setOnReadLineAtStdout(childProcess: ChildProcess){
        if(childProcess.stdout === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stdout).on('line', ((code: string) => {
            if(this.onHopCallback != null){
                const parsedHop = this.parser.parsingHop(code);
                if(parsedHop != null){
                    this.onHopCallback(parsedHop);
                }
                if(parsedHop != null && this.destination != null && this.destination.ip === parsedHop.ip){
                    this.onDestinationCallback?.call(this, this.destination);
                }
            }
        }));
    }

    private setOnReadLineAtStderr(childProcess: ChildProcess){
        if(childProcess.stderr === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stderr).once('line', ((code: string) => {
            if(this.onFindDestinationIPCallback != null){
                const parsedDestination = this.parser.parsingDestination(code);
                if(parsedDestination != null){
                    this.onFindDestinationIPCallback(parsedDestination);
                    this.destination = parsedDestination;
                }
            }
        }));
    }

    private setOnError(childProcess: ChildProcess){
        childProcess.on('error', ((err: Error) => {
            this.end()
            if(this.onErrorCallback != null){
                this.onErrorCallback(err)
            }
        }))
    }

    private setOnRawMessage(childProcess: ChildProcess) {
        if(childProcess.stdout === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        if(childProcess.stderr === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stdout).on('line', ((code: string) => {
            if(this.onRawMessageCallback != null){
                this.onRawMessageCallback(code);
            }
        }));
        createInterface(childProcess.stderr).on('line', ((code: string) => {
            if(this.onRawMessageCallback != null){
                this.onRawMessageCallback(code);
            }
        }));
    }

    end() {
        if(this.status === RouteFinderStatus.BeforeStart){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        if(this.childProcess == null){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        this.status = RouteFinderStatus.End;
        if(!this.childProcess?.killed){
            this.childProcess?.kill();
        }
    }

}
