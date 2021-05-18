import {Injectable, Logger} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {Cron, CronExpression} from "@nestjs/schedule";
import {Result} from "../../../shared/core/Result";
import {SyncNewsCommand} from "../../aplication/commands/impl/sync-news.command";

@Injectable()
export class SyncNewsServices {
  private processing = false;
  readonly _logger: Logger;
  constructor(
    readonly cBus: CommandBus,
  ) {
    this._logger = new Logger(SyncNewsServices.name);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncNews() {
    if(this.processing) return;
    this.processing = true;
    const result: Result<void> = await this.cBus.execute(
      new SyncNewsCommand(),
    );
    if(result.isFailure) {
      this._logger.error(result.unwrapError().pretty());
    }
    this.processing = false;
    this._logger.log('Finished');
  }
}