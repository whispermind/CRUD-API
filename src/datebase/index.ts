import { v4 as uuidv4 } from 'uuid';
import { IUser } from './IData';

export interface IStorage {
  [key: string]: IUser
}

class DB {
  static storage: IStorage = {};

  static add(itemData: Omit<IUser, 'id'>) {
    const id = uuidv4();
    DB.storage[id] = { ...itemData, id };
    return true;
  }

  static remove(id: string) {
    if (DB.storage[id]) {
      delete DB.storage[id];
      return true;
    }
    return false;
  }

  static get(id?: string) {
    return id ? DB.storage[id] : DB.storage;
  }

  static update(body: IUser) {
    DB.storage[body.id] = body;
  }
}

export default DB;
