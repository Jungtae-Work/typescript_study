const debug = require('debug')('send-handlers');

import { RedisClientType } from 'redis';

let _sender: RedisClientType;

//------------------------------------------------------------------------------

export function connect(cachedb: RedisClientType): void {
    (async () => {
        try {
            // Sender 채널 연결
            _sender = cachedb.duplicate();
            await _sender.connect();
            // Sender 핸들러 연결
            await _sender.subscribe('channel', _send_handler);
            debug('* Channel Connected: [ %s ]', cachedb.options?.url);
        } catch (error) {
            console.log('Redis Client Error', error);
            process.exit(1);
        }
    })();
}

export function disconnect(): void {
    _sender.disconnect();
}

//------------------------------------------------------------------------------

function _send_handler(message: any, channel: string): void {
    console.log('채널:', channel, '메시지:', message);
}
