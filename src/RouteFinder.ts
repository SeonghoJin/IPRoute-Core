import {RouteFinderStatus} from "./RouteFinderStatus";
import {RouteFinderErrorMessage} from "./RouteFinderErrorMessage";
import {ChildProcess} from 'child_process';
import {EventEmitter} from 'events';
import {createInterface} from 'readline';
import {RouteFinderProcessFactory} from "./process/RouteFinderProcessFactory";
import {RouteFinderParser} from "./parser/RouteFinderParser";

export class RouteFinder extends EventEmitter{
    hostname: string;
    status: RouteFinderStatus;
    private childProcess: ChildProcess | null = null;
    private parser: RouteFinderParser;
    private processFactory: RouteFinderProcessFactory;

    constructor(hostname: string, parser: RouteFinderParser, processFactory: RouteFinderProcessFactory) {
        super();
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
    }

    private setOnClose(childProcess : ChildProcess){
        childProcess.on('close', ((code: string) => {
            this.emit('close', code);
        }))
    }

    private setOnReadLineAtStdout(childProcess: ChildProcess){
        if(childProcess.stdout === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stdout).on('line', ((code: string) => {
            this.emit('data', code);
        }));
    }

    private setOnReadLineAtStderr(childProcess: ChildProcess){
        if(childProcess.stderr === null){
            throw new Error(RouteFinderErrorMessage.NotCreatedStdout);
        }
        createInterface(childProcess.stderr).on('line', ((code: string) => {
            this.emit('data', code);
        }));
    }

    private setOnError(childProcess: ChildProcess){
        childProcess.on('error', ((err: Error) => {
            this.emit('error', err);
        }))
    }

    end() {
        if(this.status === RouteFinderStatus.End){
            throw new Error(RouteFinderErrorMessage.AlreadyEnded);
        }
        if(this.status !== RouteFinderStatus.Start){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        this.childProcess?.kill();
        this.status = RouteFinderStatus.End;
    }

}