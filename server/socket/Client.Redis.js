import IORedis from 'ioredis';

const Redis = new IORedis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
});

const get = (data) => {
  const { id, type } = data;
  return new Promise((resolve, reject) => {
    Redis.hgetall(`w-api:${type}:${id}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const set = async (data) => {
  const { id, name, type } = data;
  return new Promise((resolve, reject) => {
    Redis.hmset(`w-api:${type}:${id}`, [
      'id',
      id,
      'name',
      name,
      'type',
      type,
    ], (err) => {
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
    Redis.del(`w-api:${type}:${id}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const clear = () => new Promise((resolve, reject) => {
  Redis.keys('w-api:*', (e, keys) => {
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
          console.log('Client.Redis: Redis clear!'); // eslint-disable-line
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
