import RandomString from 'randomstring';
import NameList from './namelist';

export const getRandomClient = type => ({
  id: RandomString.generate({ length: 12, charset: 'numeric' }),
  type,
  name: NameList[Math.floor(Math.random() * NameList.length)],
  key: RandomString.generate(),
});

export default {
  getRandomClient,
};
