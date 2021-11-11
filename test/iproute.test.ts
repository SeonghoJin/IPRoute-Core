import {it} from "mocha";
import RouteFinder from "../src/RouteFinder";
import {expect} from "chai";
import {RouteFinderStatus} from "../src/RouteFinderStatus";

describe('라우터 테스트', function () {

    it("IP라우팅이 실행되기전, RouteFinder의 상태는 BeforeStart", () => {
        const ipRoute = new RouteFinder("test.com");
        expect(ipRoute.status).to.be.eql(RouteFinderStatus.BeforeStart);
    });

    it("IP라우팅이 실행 후, RouteFinder의 상태는 Start", () => {
        const ipRoute = new RouteFinder("test.com");
        ipRoute.start();
        expect(ipRoute.status).to.be.eql(RouteFinderStatus.Start);
    });

    it("IP라우팅 끝나면, RouteFinder의 상태는 End", () => {
        const ipRoute = new RouteFinder("test.com");
        ipRoute.start();
        ipRoute.end();
        expect(ipRoute.status).to.be.eql(RouteFinderStatus.End);
    });

});