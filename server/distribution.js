import IORedis from 'ioredis';

const Redis = new IORedis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
});

const getClient = (data) => {
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
const setClient = async (data) => {
  const { id, name, type } = data;
  return new Promise((resolve, reject) => {
    Redis.hmset(`w-api:${type}:${id}`, 'id', id, 'name', name, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const removeClient = (data) => {
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
  Redis.keys('w-api:*', (err, keys) => {
    if (err) {
      reject(err);
    } else {
      const pipeline = Redis.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      pipeline.exec((err2) => {
        if (err) {
          reject(err2);
        } else {
          console.log('Distribution: Redis clear!');
          resolve();
        }
      });
    }
  });
});

export {
  setClient,
  getClient,
  removeClient,
  clear,
};
