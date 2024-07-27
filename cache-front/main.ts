const debug = require('debug')('main');

require('dotenv').config();
import cachedb = require('./cache-db');
import sender = require('./send-handlers')

//------------------------------------------------------------------------------

function sleep(sec: number) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

function startServer(): void {
    (async () => {
        cachedb.connect();
        sender.connect(cachedb.getCacheDB());
        await sleep(1);

    })();
}

//------------------------------------------------------------------------------
// 서버 시작 함수
debug('Program Begin');

startServer();
