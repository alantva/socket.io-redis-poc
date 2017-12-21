// import moment from 'moment';

const createProtocol = () => {
  // const randomNum = Math.floor(10000000 + (Math.random() * 90000000));
  const randomNum = Math.floor(Math.random() * 1000);
  // const prefix = moment().format('YYYYMMDD');
  const prefix = '00';
  return `${prefix}${randomNum}`;
};

export {
  createProtocol,
};
