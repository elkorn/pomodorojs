var spawn = require("child_process").spawn;
var fs = require("fs");
var format = require("util").format;
var path = require("path");
var statsfile = path.resolve(__dirname, "../statsfile");
var tempfile  = path.resolve(__dirname, "../.tempfile");

var DATA_FORMAT = "%s\t%s\n";
var INPUT_BOX_PARAMS = ["-e", format("dialog --inputbox \"Tags for pomodoro:\" 8 40 2> %s", tempfile)];

function makeData(tags) {
    return format(DATA_FORMAT, new Date(), tags);
}

function getTempData() {
    return fs.readFileSync(tempfile, {encoding: "utf-8"});
}

function storeTagInfo (tags) {
    fs.appendFileSync(statsfile, makeData(tags));
}

function showTagDialog(dataCallback) {
    var dialog = spawn("xterm", INPUT_BOX_PARAMS);
    dialog.on("close", function(data) {
        dataCallback(getTempData());
    });
}

module.exports = {
    getTagsForPomodoro: function(callback) {
        showTagDialog(function(data){
            storeTagInfo(data);
            callback();
        });
    }
};
