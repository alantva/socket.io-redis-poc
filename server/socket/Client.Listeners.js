import { get as ClientGet, remove as ClientRemove } from './Client.Redis';
import { push as QueuePush, remove as QueueRemove } from './Queue.Redis';
import { remove as RoomRemove, get as RoomGet } from './Room.Redis';
import {
  saveRegister as ClientSaveRegister,
  assignPartners as ClientAssignPartners,
  assignToRoom as ClientAssignToRoom,
} from './Client';

module.exports = (SS) => {
  SS.on('connection', async (socket) => {
    /* Register a client */
    const client = await ClientSaveRegister(socket);
    const BOTNAME = `${client.type.toUpperCase()} BOT`;
    /* Assign the client to a queue */
    await QueuePush(client);
    /* Assign the client to partner */
    const partner = await ClientAssignPartners(client);

    if (partner) {
      /* Unassign the client to a queue */
      await QueueRemove(client);

      /* Assign the client and the partner to a room */
      const { roomID } = await ClientAssignToRoom([client, partner]);

      SS.to(partner.socketID).emit('room', { roomID });
      socket.emit('room', { roomID });
    }

    socket.on('message', async (data) => {
      const { roomID } = data;
      console.log(`\n${BOTNAME}: ${client.name} enviou uma mensagem.`); // eslint-disable-line
      const roomClientsIDs = await RoomGet({ id: roomID });
      const roomClients = await Promise.all(roomClientsIDs.map(async (roomClientID) => {
        const ifUser = await ClientGet({ id: roomClientID, type: 'user' });
        const ifCustomer = await ClientGet({ id: roomClientID, type: 'customer' });
        return ifUser || ifCustomer;
      }));
      const roomSockets = roomClients.map(roomClient => roomClient.socketID);
      roomSockets.forEach((roomSocket) => {
        SS.to(roomSocket).emit('message', data);
      });
    });

    socket.on('disconnect', async () => {
      await Promise.all([
        ClientRemove(client),
        QueueRemove(client),
        RoomRemove([client.id]),
      ]);
      console.log(`\n${BOTNAME}: ${client.name} se desconectou. :(`); // eslint-disable-line
    });
  });
};
