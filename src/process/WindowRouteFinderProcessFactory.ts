import {RouteFinderProcessFactory} from "./RouteFinderProcessFactory";
import {ChildProcess, spawn} from "child_process";

export class WindowRouteFinderProcessFactory implements RouteFinderProcessFactory{

    command = "tracert"

    createProcess(domainName: string): ChildProcess {
        return spawn(this.command, [domainName]);
    }

}