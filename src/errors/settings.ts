import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** Settings text could not be parsed or failed validation. */
export class SettingsError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.SettingsInvalid, message, options);
        this.name = 'SettingsError';
    }
}
