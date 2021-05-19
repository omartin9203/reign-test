import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import {Logger} from "@nestjs/common";

export const databaseConfig = registerAs('database', () => ({
  connectString: process.env.DATABASE_CONNECT_STRING,
}));
Logger.debug('------------------------' + process.env.DATABASE_CONNECT_STRING + '------------------------');
export const databaseSchema = {
  DATABASE_CONNECT_STRING: Joi
    .string()
    .default('mongodb://mongo:27017/reign_test'),
};
