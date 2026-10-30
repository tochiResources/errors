import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A payload, schema or argument failed validation. */
export class ValidationError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.ValidationFailed, message, options);
        this.name = 'ValidationError';
    }
}
