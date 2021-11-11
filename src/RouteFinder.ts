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
    private onDestinationCallback: ((destination: Destination) => void) | null = null;
    private onErrorCallback: ((err: Error) => void) | null = null;
    private onCloseCallback: ((msg: string) => void) | null = null;
    private onRawMessageCallback: ((msg: string) => void) | null = null;


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
        } catch (e) {
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
            }
            if(this.onRawMessageCallback != null){
                this.onRawMessageCallback(code);
            }
        }));
    }

    private setOnReadLineAtStderr(childProcess: ChildProcess){
        if(childProcess.stderr === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stderr).once('line', ((code: string) => {
            if(this.onDestinationCallback != null){
                const parsedDestination = this.parser.parsingDestination(code);
                if(parsedDestination != null){
                    this.onDestinationCallback(parsedDestination);
                }
            }
        }));
    }

    private setOnError(childProcess: ChildProcess){
        childProcess.on('error', ((err: Error) => {
            if(this.onErrorCallback != null){
                this.onErrorCallback(err)
                this.end();
            }
        }))
    }

    end() {
        if(this.status === RouteFinderStatus.End){
            throw new Error(RouteFinderErrorMessage.AlreadyEnded);
        }
        if(this.status !== RouteFinderStatus.Start){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        if(this.childProcess == null){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        if(!this.childProcess?.killed){
            this.childProcess?.kill();
        }
        this.status = RouteFinderStatus.End;
    }

}