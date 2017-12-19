const ClientRedis = require('./Client.Redis');
const Client = require('./Client');

module.exports = (namespaceCustomer, namespaceUser) => {
  namespaceCustomer.on('connection', async (socket) => {
    /* Register a customer */
    const client = await Client.register(socket);

    socket.on('message', (data) => {
      console.log(`\nCUSTOMER Bot: ${client.name} enviou uma mensagem.`); // eslint-disable-line
      namespaceUser.emit('message', data);
      socket.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log(`\nCUSTOMER Bot: ${client.name} se desconectou. :(`); // eslint-disable-line
      if (ClientRedis.remove(client)) {
        console.log(`\nCUSTOMER Bot: ${client.name} teve seu registro removido. :)`); // eslint-disable-line
      }
    });
  });
};
