var spawn = require("child_process").spawn;
var format = require("util").format;

var COMMANDS = {
    SET_STATUS: "setstatus?status=%s&message=%s",
    SET_STATUS_NO_MESSAGE: "setstatus?status=%s",
    GET_STATUS_MESSAGE: "getstatusmessage",
    GET_STATUS: "getstatus"
};

var rememberedStatus = {};

function spawnWithArgs(args) {
    return spawn("purple-remote", [args]);
}

function rememberCurrentStatus() {
    module.exports.getStatusMessage(function(message) {
        rememberedStatus.message = message.length === 1 ? "" : message.toString().substr(0, message.length - 1);
        console.log("remembered message " + message);
    });

    spawnWithArgs(COMMANDS.GET_STATUS).stdout.on("data", function(status) {
        rememberedStatus.status = status.toString().substr(0, status.length - 1);
        console.log("Remembered status " + status);
    });
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
    },
    restoreStatus: function(options) {
        console.log("Restoring status " + JSON.stringify(rememberedStatus));
        this.changeStatus(rememberedStatus);
    }
};

rememberCurrentStatus();
