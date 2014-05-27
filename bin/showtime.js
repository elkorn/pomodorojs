#!/usr/bin/node

console.log(require("fs").readFileSync(require("path").resolve(__dirname, "../statefile"), {
    encoding: "utf-8"
}).split("|")[2] || "--:--");
// cat "$(realpath ../src/statefile)" | sed 's/.*|.*|\([0-9]\{2\}:[0-9]\{2\}\)/\1/'