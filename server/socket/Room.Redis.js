import IORedis from 'ioredis';
import { createProtocol } from './util';

const Redis = new IORedis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
});

const get = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    Redis.lrange(`w-api:room:${id}`, 0, -1, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const set = async (data) => {
  const { id = createProtocol(), clients = [] } = data;
  const clientsIDs = clients.map(client => client.id);
  return new Promise((resolve, reject) => {
    const pipeline = Redis.pipeline();
    clientsIDs.forEach((clientID) => {
      pipeline.rpush(`w-api:room:${id}`, clientID);
    });
    pipeline.exec((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
};
const remove = (data) => {
  const { id, clientsIDs = [] } = data;
  return new Promise((resolve, reject) => {
    const pipeline = Redis.pipeline();
    clientsIDs.forEach((clientID) => {
      pipeline.lrem(`w-api:room:${id}`, 1, clientID);
    });
    pipeline.exec((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const clear = () => new Promise((resolve, reject) => {
  Redis.keys('w-api:room:*', (e, keys) => {
    if (e) {
      reject(e);
    } else {
      const pipeline = Redis.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      pipeline.exec((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Room.Redis: Redis room clear!'); // eslint-disable-line
          resolve();
        }
      });
    }
  });
});

export {
  set,
  get,
  remove,
  clear,
};
