import {UnixRouteFinderParser} from "../src/parser/UnixRouteFinderParser";
import {UnixRouteFinderProcessFactory} from "../src/process/UnixRouteFinderProcessFactory";
import {platform} from "os"
import {it} from "mocha";
import {RouteFinder} from "../src/RouteFinder";
import {expect} from "chai";
import {RouteFinderStatus} from "../src/RouteFinderStatus";

describe('UnixRouteFinder Test', function () {
    const currentOS : NodeJS.Platform = platform();
    if(currentOS !== 'darwin' && currentOS !== 'linux'){
        return;
    }

    const parser = new UnixRouteFinderParser();
    const factory = new UnixRouteFinderProcessFactory();

    it("routeFinder 시작전", () => {
        const routeFinder = new RouteFinder("naver.com", parser, factory);
        expect(routeFinder.status).to.be.eql(RouteFinderStatus.BeforeStart);
    })

    it("routeFinder 시작 후", async () => {
        const routeFinder = new RouteFinder("naver.com", parser, factory);
        routeFinder.on('data', (data: string) => {
            expect(routeFinder.status).to.be.eql(RouteFinderStatus.Start);
        })
        routeFinder.start();
        routeFinder.end();
    });

    it("routeFinder 종료", async () => {
        const routeFinder = new RouteFinder("naver.com", parser, factory);
        routeFinder.start();
        routeFinder.end();
        expect(routeFinder.status).to.be.eql(RouteFinderStatus.End);
    });
});