var fs = require("fs");
var format = require("util").format;
var statefile = "statefile";
var timespan = require("timespan");
var zpad = require("zpad");
zpad.amount(2);

function toMinuteDisplay(msec) {
    var d = new Date(msec);
    return format("%s:%s", zpad(d.getMinutes()), zpad(d.getSeconds()));
}

function unmarshalState(state) {
    var data = state.split("|");
    console.log(data);
    return {
        state: data[0],
        number: parseInt(data[1]),
        timeLeft: data[2]
    };
}

function marshalState(state) {
    return format("%s|%s|%s", state.state, state.number, state.timeLeft ? toMinuteDisplay(state.timeLeft) : "");
}

module.exports = {
    recordPomodoro: function() {
        var state = fs.readFileSync(statefile, {
            encoding: 'utf8'
        });
        if (state.length) {
            var stateInfo = unmarshalState(state);
            fs.writeFileSync(statefile, marshalState({
                state: stateInfo.state,
                number: stateInfo.number + 1,
                timeLeft: stateInfo.timeLeft
            }));
        } else {
            fs.writeFileSync(statefile, marshalState({
                state: "pomodoro",
                number: 1,
                timeLeft: 0
            }));
        }
    },

    recordTime: function(msecs) {
        var state = fs.readFileSync(statefile, {
            encoding: 'utf8'
        });

        var stateInfo = unmarshalState(state);
        fs.writeFileSync(statefile, marshalState({
            state: stateInfo.state,
            number: stateInfo.number,
            timeLeft: msecs
        }));
    }
};