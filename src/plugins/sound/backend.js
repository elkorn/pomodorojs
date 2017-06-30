const spawn = require('child_process').spawn;
const path = require('path');

const beep = path.resolve(__dirname, '../../../beep.mp3');

const play = () => spawn('mpg123', [ beep ]);


module.exports = { play };

