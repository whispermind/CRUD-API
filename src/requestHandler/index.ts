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

  static userIdRegExp = /\/users\/.+$/i;

  static get(urlData: UrlWithStringQuery): IResponse {
    const endPoint = urlData.path;
    switch (endPoint) {
      case endPoint?.match(RequestHandler.userIdRegExp)?.toString(): {
        const index = endPoint.lastIndexOf('/');
        const uuid = endPoint.slice(index + 1);
        const isError = RequestHandler.validateUuid(uuid);
        let status = 200;
        let message = '';

        if (isError) {
          return isError;
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
          message,
        };
      }
      case '/users': {
        const payload = JSON.stringify(DB.get());
        const status = 200;
        return { payload, status };
      }
      default: {
        return RequestHandler.endPointError;
      }
    }
  }

  static post(urlData: UrlWithStringQuery, body: Omit<IUser, 'id'>): IResponse {
    const endPoint = urlData.path;
    switch (endPoint) {
      case '/users': {
        const isError = RequestHandler.validateData(body);
        if(isError){
          return isError
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

  static put(urlData: UrlWithStringQuery, body: Omit<IUser, 'id'>) {
    const endPoint = urlData.path;
    const index = endPoint!.lastIndexOf('/');
    const uuid = endPoint!.slice(index + 1);

    switch (endPoint) {
      case endPoint?.match(RequestHandler.userIdRegExp)?.toString(): {
        const isUuidError = RequestHandler.validateUuid(uuid);
        const isDataEror = RequestHandler.validateData(body);

        if (isUuidError || isDataEror) {
          return isUuidError || isDataEror
        }

        const result = DB.update(uuid, body);
        return {
          status: result ? 200 : 404,
          payload: null,
        };
      }

      default: {
        return RequestHandler.endPointError;
      }
    }
  }

  static delete(urlData: UrlWithStringQuery) {
    const endPoint = urlData.path;
    const index = endPoint!.lastIndexOf('/');
    const uuid = endPoint!.slice(index + 1);

    switch (endPoint) {
      case endPoint?.match(RequestHandler.userIdRegExp)?.toString(): {
        const isError = RequestHandler.validateUuid(uuid);

        if (isError) {
          return isError;
        }

        const result = DB.remove(uuid);
        return {
          status: result ? 204 : 404,
          payload: null,
        };
      }

      default: {
        return RequestHandler.endPointError;
      }
    }
  }

  static validateUuid(uuid: string): IResponse | null {
    if (!validate(uuid)) {
      const status = 400;
      const message = 'invalid user id';
      return { status, payload: null, message };
    }

    return null;
  }

  static validateData(body: Omit<IUser, 'id'>){
    if (!body.age || !body.hobbies || !body.username) {
      return {
        status: 400,
        payload: null,
        message: 'does not contain required fields',
      };
    }
    return null
  }
}

export default RequestHandler;
