import {RouteFinderProcessFactory} from "./RouteFinderProcessFactory";
import {ChildProcess, spawn} from "child_process";

export class UnixRouteFinderProcessFactory implements RouteFinderProcessFactory{

    command = "traceroute"
    
    createProcess(domainName: string): ChildProcess {
        return spawn(this.command, [domainName]);
    }

}