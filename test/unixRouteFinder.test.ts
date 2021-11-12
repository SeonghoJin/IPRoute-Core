import {UnixRouteFinderParser} from "../src/parser/UnixRouteFinderParser";
import {UnixRouteFinderProcessFactory} from "../src/process/UnixRouteFinderProcessFactory";
import {platform} from "os"
import {it} from "mocha";
import {RouteFinder} from "../src/RouteFinder";
import {assert, expect} from "chai";
import {RouteFinderStatus} from "../src/RouteFinderStatus";

describe('UnixRouteFinder Status Test', function () {

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
        routeFinder.onDestination((destination => {
            expect(routeFinder.status).to.be.eql(RouteFinderStatus.Start);
        })).start().end();
    });

    it("routeFinder 종료", async () => {
        const routeFinder = new RouteFinder("naver.com", parser, factory);
        routeFinder.start();
        routeFinder.end();
        expect(routeFinder.status).to.be.eql(RouteFinderStatus.End);
    });

});

describe('UnixRouteFinder Feature Test', function () {

    const currentOS : NodeJS.Platform = platform();
    if(currentOS !== 'darwin' && currentOS !== 'linux'){
        return;
    }

    const parser = new UnixRouteFinderParser();
    const factory = new UnixRouteFinderProcessFactory();

    it("onDestination", async () => {
        return new Promise((res) => {
            const routeFinder = new RouteFinder("localhost", parser, factory);
            routeFinder.onDestination(destination => {
                assert(destination.ip != null);
            }).onClose(msg => {
                res();
            }).start();
        })
    })

    it("onHop", async () => {
        return new Promise((res) => {
            const routeFinder = new RouteFinder("localhost", parser, factory);
            routeFinder.onHop(hop => {
                assert(hop.hop === 1);
            }).onClose(msg => {
                res();
            }).start();
        })
    })

    it("force end", async () => {
        return new Promise((res) => {
            const routeFinder = new RouteFinder("localhost", parser, factory);
            routeFinder.onClose((msg) => {
                if(currentOS === "darwin"){
                    expect(msg).to.be.equal(null);
                }
                if(currentOS === 'linux'){
                    expect(msg).to.be.equal(-2);
                }
            }).start().end();
            res();
        })
    })

});