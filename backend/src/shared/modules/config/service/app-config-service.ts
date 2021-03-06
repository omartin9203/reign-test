import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDataBaseConfig } from '../interfaces/IDataBaseConfig';
import { IAppConfig } from '../interfaces/IAppConfig';
import { IGraphqlConfig } from '../interfaces/IGraphqlConfig';

const logLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
function getLogLevel(level: string): LogLevel[] {
  const lvlIndex = logLevels.findIndex(ll => ll === level);
  return logLevels.filter((ll: LogLevel, index: number) => {
    if (lvlIndex <= index) return ll;
  });
}
@Injectable()
export class AppConfigService {
  constructor(private readonly _configService: ConfigService) {}

  app: IAppConfig = {
    cors: this._configService.get<boolean>('app.cors'),
    port: this._configService.get<number>('app.port'),
    nodeEnv: this._configService.get<string>('app.nodeEnv'),
    logLevel: getLogLevel(this._configService.get<string>('app.logLevel')),
  };

  database: IDataBaseConfig = {
    connectString:
      this._configService.get<string>('database.connectString'),
  };

  graphql: IGraphqlConfig = {
    schema: this._configService.get<string>('graphql.schema'),
    maxFiles: this._configService.get<number>('graphql.maxFiles'),
    maxFileSize: this._configService.get<number>('graphql.maxFileSize'),
    depthLimit: this._configService.get<number>('graphql.depthLimit'),
  };
}
