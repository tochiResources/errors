import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** Configuration is missing or failed validation. */
export class ConfigError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.ConfigInvalid, message, options);
        this.name = 'ConfigError';
    }
}
