import { Injectable } from '@nestjs/common';
import { IUnitOfWork } from 'src/shared/core/interfaces/IUnitOfWork';
import {
  IRepository,
  IRepositoryFactory,
} from 'src/shared/core/interfaces/IRepository';
import {ClientSession, Connection} from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class MongooseUnitOfWork implements IUnitOfWork {
  private session?: ClientSession;
  constructor(
    @InjectConnection() private readonly asyncDatabaseConnection: Connection,
  ) { }

  getRepository<
    E,
    F,
    I extends string,
    T extends IRepository<E, F, I>>(Fact: IRepositoryFactory<E, F, I, T>): T {
    switch (true) {
      case !this.session:
        throw new Error('Transaction must be started');
      case this.session.inTransaction():
        throw new Error('QueryRunner has been released');
      default:
        return Fact.build();
    }
  }

  async start(): Promise<void> {
    this.session = await this.asyncDatabaseConnection.startSession();
    this.session.startTransaction();
  }

  async commit<T>(work: () => Promise<T> | T): Promise<T> {
    try {
      const result = await work();
      await this.session.commitTransaction();
      return result;
    } catch (error) {
      await this.session.abortTransaction();
      throw error;
    } finally {
      this.session.endSession();
      this.session = undefined;
    }
  }
}
