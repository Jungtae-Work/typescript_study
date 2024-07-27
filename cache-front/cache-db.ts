const debug = require('debug')('cache-db');

import { RedisClientType } from "redis";
const redis = require('redis');

let _cache: RedisClientType;

//------------------------------------------------------------------------------

export function connect(): void {
    (async () => {
        try {
            const cacheUrl = `redis://${process.env.CACHE_DB_HOST}:${process.env.CACHE_DB_PORT}/${process.env.CACHE_DB_NUM}`;
            // Cache DB(Redis) 연결
            _cache = redis.createClient({ url: cacheUrl });
            await _cache.connect();
            debug('* CacheDB Connected: [ %s ]', cacheUrl);
        } catch (error) {
            console.log('Redis Client Error', error);
            process.exit(1);
        }
    })();
}

export function disconnect(): void {
    _cache.disconnect();
}

export function getCacheDB(): RedisClientType {
    return _cache;
}
