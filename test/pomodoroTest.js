var should = require("should");

describe("Pomodoro Tracker", function() {
    it("SHOULD exist", function() {
        var tracker = require("../src/tracker");
        should.exist(tracker);
    });
});