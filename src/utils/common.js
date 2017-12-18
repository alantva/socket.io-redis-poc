import RandomString from 'randomstring';
import NameList from './namelist';
import { createCookie } from './cookie';

export const getRandomClient = (type) => {
  const client = {
    id: RandomString.generate({ length: 12, charset: 'numeric' }),
    type,
    name: NameList[Math.floor(Math.random() * NameList.length)],
    key: RandomString.generate(),
  };
  createCookie('_SCClientInfo', JSON.stringify(client), 1);
  return client;
};

export default {
  getRandomClient,
};
