import {it} from "mocha";
import IPRoute from "../src/IPRoute";
import {expect} from "chai";

describe('라우터 테스트', function () {
    it("start route and get any string", () => {
        const ipRoute = new IPRoute("test.com");
        expect(typeof ipRoute.start()).to.be.eql('string');
    })
});