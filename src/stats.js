var spawn = require("child_process").spawn;
var fs = require("fs");
var format = require("util").format;
var path = require("path");
var statsfile = path.resolve(__dirname, "../statsfile");
var tempfile = path.resolve(__dirname, "../.tempfile");

var DATA_FORMAT = "%s\t%s\n";
var INPUT_BOX_PARAMS = ["-e", format("dialog --inputbox \"Tags for pomodoro:\" 8 40 2> %s", tempfile)];

if (!fs.existsSync(statsfile)) {
  fs.writeFileSync(statsfile);
}

if (!fs.existsSync(tempfile)) {
  fs.writeFileSync(tempfile);
}

function makeData(tags) {
  return format(DATA_FORMAT, new Date(), tags);
}

function getTempData() {
  return fs.readFileSync(tempfile, {
    encoding: "utf-8"
  });
}

function getStats() {
  if (!fs.statSync(statsfile).isFile()) {
    fs.writeFileSync(statsfile);
  }

  return fs.readFileSync(statsfile, {
    encoding: "utf-8"
  })
    .split("\n");
}

function storeTagInfo(tags) {
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
    showTagDialog(function(data) {
      storeTagInfo(data);
      callback();
    });
  },
  getPomodoros: function(options) {
    var result = getStats();
    if (options.date) {
      var dateStr = options.date.toString().slice(0, 10);
      result = result.filter(function(line) {
        return line.indexOf(dateStr) === 0;
      });
    }

    if (options.tags.length) {
      result = result.filter(function(line) {
        return options.tags.every(function(tag) {
          return line.indexOf(tag) !== -1;
        });
      });
    }

    return options.onlyCount ? result.length : result.join("\n");
  }
};
