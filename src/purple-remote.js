var spawn = require("child_process").spawn;
var format = require("util").format;

var COMMANDS = {
    SET_STATUS: "setstatus?status=%s&message=%s",
    SET_STATUS_NO_MESSAGE: "setstatus?status=%s",
    GET_STATUS_MESSAGE: "getstatusmessage"
};

function spawnWithArgs(args) {
    return spawn("purple-remote", [args]);
}

module.exports = {
    getStatusMessage: function(callback) {
        var pr = spawnWithArgs(COMMANDS.GET_STATUS_MESSAGE);
        pr.stdout.on("data", function(data) {
            callback(data.toString());
        });
    },
    changeStatus: function(options) {
        spawnWithArgs(
            format(
                options.hasOwnProperty("message") ?
                COMMANDS.SET_STATUS :
                COMMANDS.SET_STATUS_NO_MESSAGE,
                options.status,
                options.message || ""));
    }
};