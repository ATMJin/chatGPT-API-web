import { IDBPDatabase, IDBPObjectStore, openDB } from 'idb';
import { DB_Chat } from '../class/db.class';

let db: IDBPDatabase;
let store_chat: IDBPObjectStore<DB_Chat>;

export const initIndexedDB: () => Promise<void> = async () => {
  const idb = await openDB('gpt_api', 1, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      db.createObjectStore('chat', { keyPath: '_id', autoIncrement: true });
      db.createObjectStore('system');
    },
    blocked(currentVersion, blockedVersion, event) {
      console.log("getLastResult Error");
      console.log("IndexedDB blocked");
    },
    blocking(currentVersion, blockedVersion, event) {
      console.log("getLastResult Error");
      console.log("IndexedDB blocking");
    },
    terminated() {
      console.log("getLastResult Error");
      console.log("IndexedDB terminated");
    },
  });
  db = idb;
  // store_chat = db.transaction('chat', 'readwrite').objectStore('chat');
};
