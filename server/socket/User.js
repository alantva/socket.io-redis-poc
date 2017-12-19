const ClientRedis = require('./Client.Redis');
const Client = require('./Client');

/*
  Client: {
    id: String,
    name: String,
    type: String,
  }
*/

module.exports = (namespaceUser, namespaceCustomer) => {
  namespaceUser.on('connection', async (socket) => {
    /* Register a user */
    const client = await Client.register(socket);

    await Client.assign(client);

    socket.on('message', (data) => {
      console.log(`\nUSER Bot: ${client.name} enviou uma mensagem.`); // eslint-disable-line
      namespaceCustomer.emit('message', data);
      socket.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log(`\nUSER Bot: ${client.name} se desconectou. :(`); // eslint-disable-line
      if (ClientRedis.remove(client)) {
        console.log(`\nUSER Bot: ${client.name} teve seu registro removido. :)`); // eslint-disable-line
      }
    });
  });
};
