import {RouteFinderParser} from "./RouteFinderParser";
import {Destination, Hop} from "../interfaces";
import {Address4}from "ip-address";
import { regex } from "./regex";


export class UnixRouteFinderParser implements RouteFinderParser {

    parsingHop(str: string): Hop | null{
        try {
            const ipv4 = regex.IPv4RegexWithParentheses.exec(str);
            const ipv4Length = ipv4?.toString().length || 0;
            const time = regex.timeRegex.exec(str);
            const hop = regex.hopRegex.exec(str);
            const parseIntHop = parseInt(hop?.toString() as string);
            if(Number.isNaN(parseIntHop)){
                throw new Error("Can not Parsing Hop");
            }
            return {
                ip: new Address4(ipv4?.toString().slice(1, ipv4Length - 1) as string),
                time: time?.toString() as string,
                hop: parseIntHop,
            };
        } catch (e) {
            // console.error(e);
            return null;
        }
    }

    parsingDestination(str: string): Destination | null{
        try {
            const ipv4 = regex.IPv4Regex.exec(str);
            return {
                ip: new Address4(ipv4?.toString() as string),
            };
        } catch (e) {
            // console.error(e);
            return null;
        }
    }
}