import {ChildProcess} from "child_process";

export interface RouteFinderProcessFactory {
    createProcess : (domainName: string) => ChildProcess;
}