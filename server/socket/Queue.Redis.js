import IORedis from 'ioredis';

const Redis = new IORedis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
});

const pop = (data) => {
  const { type } = data;
  return new Promise((resolve, reject) => {
    Redis.lpop(`w-api:queue:${type}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const push = async (data) => {
  const { id, type } = data;
  return new Promise((resolve, reject) => {
    Redis.rpush(`w-api:queue:${type}`, id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const remove = (data) => {
  const { id, type } = data;
  return new Promise((resolve, reject) => {
    Redis.lrem(`w-api:queue:${type}`, 1, id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const clear = () => new Promise((resolve, reject) => {
  Redis.keys('w-api:queue:*', (e, keys) => {
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
          console.log('Queue.Redis: Redis queues clear!'); // eslint-disable-line
          resolve();
        }
      });
    }
  });
});

export {
  pop,
  push,
  remove,
  clear,
};
