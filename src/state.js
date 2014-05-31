var fs = require("fs");
var format = require("util").format;
var statefile = require("path").resolve(__dirname, "../statefile");
var zpad = require("zpad");
zpad.amount(2);

if (!fs.existsSync(statefile)) {
    fs.writeFileSync(statefile);
}

function toMinuteDisplay(msec) {
    if (isNaN(msec)) {
        return "--:--";
    }

    var d = new Date(msec);
    return format("%s:%s", zpad(d.getMinutes()), zpad(d.getSeconds()));
}

function unmarshalState(state) {
    var data = state.split("|");
    return {
        state: data[0] || "pomodoro",
        number: parseInt(data[1]) || 0,
        timeLeft: data[2] || ""
    };
}

function marshalState(state) {
    return format("%s|%s|%s", state.state, state.number, toMinuteDisplay(state.timeLeft || 0));
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
                number: stateInfo.number + 1
            }));
        } else {
            fs.writeFileSync(statefile, marshalState({
                state: "pomodoro",
                number: 1
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
    },

    zeroTime: function() {
        var state = fs.readFileSync(statefile, {
            encoding: 'utf8'
        });

        var stateInfo = unmarshalState(state);
        fs.writeFileSync(statefile, marshalState({
            state: stateInfo.state,
            number: stateInfo.number,
            timeLeft: 0
        }));
    },

    resetTime: function() {
        var state = fs.readFileSync(statefile, {
            encoding: 'utf8'
        });

        var stateInfo = unmarshalState(state);
        fs.writeFileSync(statefile, marshalState({
            state: stateInfo.state,
            number: stateInfo.number,
            timeLeft: "--"
        }));
    }

};
