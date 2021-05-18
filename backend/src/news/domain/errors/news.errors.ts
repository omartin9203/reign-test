import { BaseError } from '../../../shared/core/BaseError';
import { Result } from '../../../shared/core/Result';

export namespace NewsErrors {
  const _context = 'NewsErrors';

  export class NewsIsAlreadyUnavailable extends BaseError {
    constructor(code: string) {
      super({
        name: 'NewsIsAlreadyUnavailable',
        message: `News '${code}' is already in the unavailable state`,
        context: _context,
      });
    }
  }

  export type NewsIsAlreadyUnavailableResult<T> = Result<
    T,
    NewsIsAlreadyUnavailable
    >;

  export class NewsIsAlreadyAvailable extends BaseError {
    constructor(code: string) {
      super({
        name: 'NewsIsAlreadyAvailable',
        message: `News '${code}' is already in the available state`,
        context: _context,
      });
    }
  }

  export type NewsIsAlreadyAvailableResult<T> = Result<
    T,
    NewsIsAlreadyAvailable
    >;

  export class NewsIsInactive extends BaseError {
    constructor(code: string) {
      super({
        name: 'NewsIsInactive',
        message: `News '${code}' is inactive`,
        context: _context,
      });
    }
  }

  export type NewsIsInactiveResult<T> = Result<
    T,
    NewsIsInactive
    >;

  export class NewsByCodeDoesNotExist extends BaseError {
    constructor(code: string) {
      super({
        name: 'NewsByCodeDoesNotExist',
        message: `News '${code}' does not exist`,
        context: _context,
      });
    }
  }

  export type NewsByCodeDoesNotExistResult<T> = Result<
    T,
    NewsByCodeDoesNotExist
    >;

  export class NewsByCodeAlreadyExist extends BaseError {
    constructor(code: string) {
      super({
        name: 'NewsByCodeAlreadyExist',
        message: `News '${code}' already exist`,
        context: _context,
      });
    }
  }

  export type NewsByCodeAlreadyExistResult<T> = Result<
    T,
    NewsByCodeAlreadyExist
    >;
}