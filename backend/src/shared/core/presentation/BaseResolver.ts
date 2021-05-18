import { Logger } from '@nestjs/common';
import { IResultError } from '../interfaces/IResultError';
import { ApolloError } from 'apollo-server-express';

export abstract class BaseResolver {
  protected _logger: Logger;
  constructor(context: string) {
    this._logger = new Logger(context);
  }

  protected handleErrors(resultError: IResultError): void {
    const error = new ApolloError(resultError.message, resultError.name);
    Object.defineProperty(error, 'name', { value: resultError.name });
    throw error;
  }
}
