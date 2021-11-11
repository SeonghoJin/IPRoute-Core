import {UnixRouteFinderParser} from "../src/parser/UnixRouteFinderParser";
import {expect} from "chai";
import {Address4} from "ip-address";
import {Destination, Hop} from "../src/interfaces";

const hops : Array<string> = [
    " 1  192.168.0.1 (192.168.0.1)  44.137 ms  94.580 ms  6.012 ms",
    " 2  123.100.176.1 (123.100.176.1)  15.714 ms  94.425 ms  21.295 ms",
    " 3  * 119.77.96.53 (119.77.96.53)  22.141 ms  88.619 ms",
    " 4  119.77.96.41 (119.77.96.41)  27.070 ms  151.599 ms  25.793 ms",
    " 5  123.111.216.101 (123.111.216.101)  23.788 ms  50.445 ms  60.906 ms",
    " 6  10.105.2.160 (10.105.2.160)  40.081 ms",
    "    10.105.2.94 (10.105.2.94)  56.605 ms *",
    " 7  10.222.23.246 (10.222.23.246)  105.366 ms",
    "    10.222.23.240 (10.222.23.240)  75.336 ms",
    "    10.222.23.244 (10.222.23.244)  23.325 ms",
    " 8  10.222.13.239 (10.222.13.239)  109.728 ms",
    "    10.222.13.235 (10.222.13.235)  92.072 ms",
    "    1.255.36.91 (1.255.36.91)  34.414 ms",
    " 9  222.237.11.25 (222.237.11.25)  59.557 ms",
    "    222.237.11.27 (222.237.11.27)  44.170 ms",
    "    222.237.11.25 (222.237.11.25)  135.242 ms",
    "10  10.22.80.218 (10.22.80.218)  29.149 ms  50.260 ms",
    "    10.22.80.214 (10.22.80.214)  47.242 ms",
    "11  * * *",
    "12  * * *",
    "13  * * *",
    "14  * * *",
    "15  * * *"
];

const expectedParsedHops : Array<Hop | null> = [
    {
        ip: new Address4("192.168.0.1"),
        time: "44.137 ms",
        hop: 1,
    },
    {
        ip: new Address4("123.100.176.1"),
        time: "15.714 ms",
        hop: 2,
    },
    {
        ip: new Address4("119.77.96.53"),
        time: "22.141 ms",
        hop: 3,
    },
    {
        ip: new Address4("119.77.96.41"),
        time: "27.070 ms",
        hop: 4,
    },
    {
        ip: new Address4("123.111.216.101"),
        time: "23.788 ms",
        hop: 5,
    },
    {
        ip: new Address4("10.105.2.160"),
        time: "40.081 ms",
        hop: 6,
    },
    null,
    {
        ip: new Address4("10.222.23.246"),
        time: "105.366 ms",
        hop: 7,
    },
    null,
    null,
    {
        ip: new Address4("10.222.13.239"),
        time: "109.728 ms",
        hop: 8,
    },
    null,
    null,
    {
        ip: new Address4("222.237.11.25"),
        time: "59.557 ms",
        hop: 9,
    },
    null,
    null,
    {
        ip: new Address4("10.22.80.218"),
        time: "29.149 ms",
        hop: 10,
    },
    null,
    null,
    null,
    null,
    null,
];

const destinations: Array<string> = [
    "traceroute: Warning: hello.com has multiple addresses; using 216.239.36.21",
    "traceroute to hello.com (216.239.36.21), 64 hops max, 52 byte packets",
    "traceroute to asdf.io (122.115.77.100), 64 hops max, 52 byte packets",
    "traceroute to nnstudio.io (3.38.61.252), 64 hops max, 52 byte packets",
    "",
]

const expectedDestinations: Array<Destination | null> = [
    {
        ip: new Address4("216.239.36.21"),
    },
    {
        ip: new Address4("216.239.36.21"),
    },
    {
        ip: new Address4("122.115.77.100"),
    },
    {
        ip: new Address4("3.38.61.252"),
    },
    null,
]

describe('unix환경에서 parseData 테스트', function () {
    const parser = new UnixRouteFinderParser();
    it("parse hop data test", () => {
        hops.forEach((hop: string, index: number) => {
            const parseHop = parser.parsingHop(hop);
            const expectedParseHop = expectedParsedHops[index];
            expect(parseHop?.hop).to.equal(expectedParseHop?.hop);
            expect(parseHop?.ip.address).to.deep.equal(expectedParseHop?.ip.address);
            expect(parseHop?.time).to.equal(expectedParseHop?.time);
        });
    })

    it("parse destination data test", () => {
        destinations.forEach((destination, index) => {
            const parsedDestination = parser.parsingDestination(destination);
            const expectedParsedDestination = expectedDestinations[index];
            expect(parsedDestination?.ip.address).to.equal(expectedParsedDestination?.ip.address);
        })
    })
});