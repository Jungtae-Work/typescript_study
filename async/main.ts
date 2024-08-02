const debug = require('debug')('main');

import fs = require('node:fs');
import util = require('node:util');

const Load1 = util.promisify(fs.readFile);

function Load2(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

(async () => {
    debug('** Start');

    try {
        let data1 = await Load1('package.json', 'utf8');
        debug(data1);
        let data2 = await Load2('package1.json');
        debug(data2);
    } catch (e) {
        debug(e);
    }

    debug('** End');
})();
