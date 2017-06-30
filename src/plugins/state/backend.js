const fs = require('fs');
const path = require('path');

const stateFilePath = path.resolve(process.cwd(), '..', 'statefile');

module.exports = {
  getState: () => {
    if (!fs.existsSync(stateFilePath)) {
      fs.writeFileSync(stateFilePath);
    }

    return fs.readFileSync(stateFilePath, {
      encoding: 'utf8'
    }).trim();
  },
  setState: (state) => fs.writeFileSync(stateFilePath, state),
};
