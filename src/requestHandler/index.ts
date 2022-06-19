import { UrlWithStringQuery } from 'url';
import { validate } from 'uuid';
import DB from '../datebase/index';
import { IUser } from '../datebase/IData';

export interface IResponse {
  status: number;
  payload: string | null;
  message?: string;
}

class RequestHandler {
  static endPointError = { status: 404, message: 'endpoint doesnt exist', payload: null };

  static get(urlData: UrlWithStringQuery): IResponse {
    const endPoint = urlData.path;
    switch (endPoint) {
      case endPoint?.match(/\/users\/.+$/i)?.toString(): {
        const index = endPoint.lastIndexOf('/');
        const uuid = endPoint.slice(index + 1);
        let status = 200;
        let message = '';

        if (!validate(uuid)) {
          status = 400;
          message = 'invalid user id';
          return { status, payload: null, message };
        }
        const userData = DB.get(uuid);
        const payload = userData ? JSON.stringify(userData) : null;
        if (!payload) {
          status = 404;
          message = 'user not found';
        }
        return {
          payload,
          status,
        };
      }
      case '/users': {
        const payload = JSON.stringify(DB.get());
        const status = 200;
        return { payload, status };
      }
      default: {
        return requestHandler.endPointError;
      }
    }
  }

  static post(urlData: UrlWithStringQuery, body: Partial<IUser>): IResponse {
    const endPoint = urlData.path;
    switch (endPoint) {
      case '/users': {
        if (!body.age || !body.hobbies || !body.username) {
          return {
            status: 400,
            payload: null,
            message: 'does not contain required fields',
          };
        }
        DB.add(body as Omit<IUser, 'id'>);
        return {
          status: 201,
          payload: null,
        };
      }
      default: {
        return this.endPointError;
      }
    }
  }

  static put() {}

  static delete() {}
}

export default RequestHandler;
