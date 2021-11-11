import {Destination, Hop} from "../interfaces";

export interface RouteFinderParser {
    parsingHop : (code : string) => Hop | null;
    parsingDestination : (code : string) => Destination | null;
}