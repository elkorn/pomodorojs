const fs = require('fs');
const format = require('util').format;
const path = require('path');

const statsfile = path.resolve(__dirname, '../../statsfile');

const DATA_FORMAT = '%s\t%s\n';

const makeData = tags => format(DATA_FORMAT, new Date(), tags);

module.exports = {
  getStats() {
    if (!fs.existsSync(statsfile)) {
      fs.writeFileSync(statsfile);
    }

    return fs.readFileSync(statsfile, {
      encoding: 'utf-8',
    })
      .split('\n');
  },
  storeTagInfo(tags) {
    if (fs.existsSync(statsfile)) {
      fs.appendFileSync(statsfile, makeData(tags));
    } else {
      fs.writeFileSync(statsfile, makeData(tags));
    }
  },
};
