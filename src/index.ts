import {RouteFinderProcessFactory} from "./process/RouteFinderProcessFactory";
import {RouteFinderParser} from "./parser/RouteFinderParser";
import {platform} from "os";
import {RouteFinder} from "./RouteFinder";
import {UnixRouteFinderProcessFactory} from "./process/UnixRouteFinderProcessFactory";
import {UnixRouteFinderParser} from "./parser/UnixRouteFinderParser";
export {Hop, Destination} from "./interfaces";
export {RouteFinderStatus} from './RouteFinderStatus';

const os: NodeJS.Platform = platform();
let processFactory: RouteFinderProcessFactory;
let parser: RouteFinderParser;

if(os === 'linux' || os === 'darwin'){
    processFactory = new UnixRouteFinderProcessFactory();
    parser = new UnixRouteFinderParser();
}else {
    throw new Error(`iptrace does not support ${os}`);
}

export const iptrace = (hostname: string) => {
    return new RouteFinder(hostname, parser, processFactory);
}
