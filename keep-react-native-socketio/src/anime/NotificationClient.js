// const io = require('socket.io-client/socket.io');
import {serverUrl} from '../core/api';
import {getLogger} from '../core/utils';
import {AnimeCreated, AnimeUpdated, AnimeDeleted} from './service';

window.navigator.userAgent = 'ReactNative';

const log = getLogger('NotificationClient');

const Anime_CREATED = 'Anime/created';
const Anime_UPDATED = 'Anime/updated';
const Anime_DELETED = 'Anime/deleted';

export class NotificationClient {
  constructor(store) {
    this.store = store;
  }

  connect() {
    log(`connect...`);
    const store = this.store;
    const auth = store.getState().auth;
    this.socket = io(auth.server.url, {transports: ['websocket']});
    const socket = this.socket;
    socket.on('connect', () => {
      log('connected');
      socket
        .emit('authenticate', {token: auth.token})
        .on('authenticated', () => log(`authenticated`))
        .on('unauthorized', (msg) => log(`unauthorized: ${JSON.stringify(msg.data)}`))
    });
    socket.on(Anime_CREATED, (Anime) => {
      log(Anime_CREATED);
      store.dispatch(AnimeCreated(Anime));
    });
    socket.on(Anime_UPDATED, (Anime) => {
      log(Anime_UPDATED);
      store.dispatch(AnimeUpdated(Anime))
    });
    socket.on(Anime_DELETED, (Anime) => {
      log(Anime_DELETED);
      store.dispatch(AnimeDeleted(Anime))
    });
  };

  disconnect() {
    log(`disconnect`);
    this.socket.disconnect();
  }
}
