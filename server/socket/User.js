import { remove as ClientRemove } from './Client.Redis';
import { push as QueuePush, remove as QueueRemove } from './Queue.Redis';
import { remove as RoomRemove } from './Room.Redis';
import {
  saveRegister as ClientSaveRegister,
  assignPartners as ClientAssignPartners,
  assignToRoom as ClientAssignToRoom,
} from './Client';

module.exports = (namespaces) => {
  namespaces.user.on('connection', async (socket) => {
    /* Register a client */
    const client = await ClientSaveRegister(socket);
    /* Assign the client to a queue */
    await QueuePush(client);
    /* Assign the client to partner */
    const partner = await ClientAssignPartners(client);

    if (partner) {
      /* Unassign the client to a queue */
      await QueueRemove(client);

      /* Assign the client and the partner to a room */
      await ClientAssignToRoom([client.id, partner.id]);
    }

    socket.on('message', (data) => {
      console.log(`\nUSER Bot: ${client.name} enviou uma mensagem.`); // eslint-disable-line
      namespaces.customer.to(partner.socketID).emit('message', data);
      socket.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log(`\nUSER Bot: ${client.name} se desconectou. :(`); // eslint-disable-line
      if (ClientRemove(client)) {
        console.log(`\nUSER Bot: ${client.name} teve seu registro removido. :)`); // eslint-disable-line
      }
      if (QueueRemove(client)) {
        console.log(`\nUSER Bot: ${client.name} teve seu registro removido da fila. :)`); // eslint-disable-line
      }
      if (RoomRemove([client.id])) {
        console.log(`\nUSER Bot: ${client.name} teve seu registro removido da sala. :)`); // eslint-disable-line
      }
    });
  });
};
