const ClientRedis = require('./Client.Redis');

export const register = async (socket) => {
  /* Lendo o Cookie */
  const { _SCClientInfo } = socket.request.headers.cookie;
  const client = JSON.parse(_SCClientInfo);
  console.log(`\n${client.type.toUpperCase()} Bot: ${client.name} está online. :)`); // eslint-disable-line

  /* Criando o registro no Redis */
  await ClientRedis.set(client);
  const registeredClient = await ClientRedis.get(client);
  console.log(`\n${registeredClient.type.toUpperCase()} Bot: ${registeredClient.name} foi registrado. :)`); // eslint-disable-line
  return registeredClient;
};

export const assign = async (client) => {
  console.log('client.type', client.type);
  return client;
};

export default {
  register,
  assign,
};
