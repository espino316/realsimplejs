var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase("A module", {
    "states the obvious": function () {
        assert(true);
    }
});
