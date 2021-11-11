import {RouteFinderParser} from "./RouteFinderParser";

export class UnixRouteFinderParser implements RouteFinderParser {

    parsingData(code: string): string {
        return code;
    }
}