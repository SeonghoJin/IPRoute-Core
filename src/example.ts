import {RouteFinder} from "./RouteFinder";
import {UnixRouteFinderProcessFactory} from "./process/UnixRouteFinderProcessFactory";
import {UnixRouteFinderParser} from "./parser/UnixRouteFinderParser";

const parser = new UnixRouteFinderParser();
const factory = new UnixRouteFinderProcessFactory();
const routeFinder = new RouteFinder("naver.com", parser, factory);

routeFinder.on('data', (code: string) => {
    console.log(code.toString());
}).start();