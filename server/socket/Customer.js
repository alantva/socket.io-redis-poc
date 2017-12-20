import { remove as ClientRemove } from './Client.Redis';
import { push as QueuePush, remove as QueueRemove } from './Queue.Redis';
import {
  saveRegister as ClientSaveRegister,
  assignPartner as ClientAssignPartner,
} from './Client';

module.exports = (namespaces) => {
  namespaces.customer.on('connection', async (socket) => {
    /* Register a client */
    const client = await ClientSaveRegister(socket);
    /* Assign the client to a queue */
    await QueuePush(client);
    /* Assign the client to a partner */
    const partner = await ClientAssignPartner(client);

    if (partner) {
      /* Unassign the client to a queue */
      await QueueRemove(client);

      socket.on('message', (data) => {
        console.log(`\nCUSTOMER Bot: ${client.name} enviou uma mensagem.`); // eslint-disable-line
        namespaces.user.to(partner.socketID).emit('message');
        socket.emit('message', data);
      });
    }

    socket.on('disconnect', () => {
      console.log(`\nCUSTOMER Bot: ${client.name} se desconectou. :(`); // eslint-disable-line
      if (ClientRemove(client)) {
        console.log(`\nCUSTOMER Bot: ${client.name} teve seu registro removido. :)`); // eslint-disable-line
      }
      if (QueueRemove(client)) {
        console.log(`\nCUSTOMER Bot: ${client.name} teve seu registro removido da fila. :)`); // eslint-disable-line
      }
    });
  });
};
