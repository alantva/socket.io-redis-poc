import { set as ClientSet, get as ClientGet } from './Client.Redis';
import { pop as QueuePop } from './Queue.Redis';
import { set as RoomSet } from './Room.Redis';

const saveRegister = async (socket) => {
  try {
    /* Lendo o Cookie */
    const { _SCClientInfo } = socket.request.headers.cookie;
    const client = JSON.parse(_SCClientInfo);
    /* Criando o registro no Redis */
    client.socketID = socket.id;
    await ClientSet(client);
    console.log(`\n${client.type.toUpperCase()} BOT: ${client.name} foi registrado. :)`); // eslint-disable-line
    return client;
  } catch (err) {
    console.error('Client.saveRegister', err);
    return null;
  }
};

const recoverRegister = async (client) => {
  try {
    /* Recuperando o registro no Redis */
    const recoveredClient = await ClientGet(client);
    console.log(`\n${recoveredClient.type.toUpperCase()} BOT: ${recoveredClient.name} foi recuperado. :)`); // eslint-disable-line
    return recoveredClient;
  } catch (err) {
    console.error('Client.recoverRegister', err);
    return null;
  }
};

const assignPartners = async (client) => {
  try {
    let id;
    let type;
    switch (client.type) {
      case 'user': {
        type = 'customer';
        id = await QueuePop({ type });
        break;
      }
      case 'customer': {
        type = 'user';
        id = await QueuePop({ type });
        break;
      }
      default:
    }
    if (!id) {
      return null;
    }
    const partner = await recoverRegister({ id, type });
    return partner;
  } catch (err) {
    console.error('Client.assignClient', err);
    return null;
  }
};

const assignToRoom = async (clients) => {
  try {
    const roomID = await RoomSet({ clients });
    await Promise.all(clients.map((client) => {
      client.roomID = roomID; // eslint-disable-line
      return ClientSet(client);
    }));
    return { roomID };
  } catch (err) {
    console.error('Client.assignToRoom', err);
    return false;
  }
};

export {
  saveRegister,
  recoverRegister,
  assignPartners,
  assignToRoom,
};
