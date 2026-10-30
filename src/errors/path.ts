import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A path was malformed or violated the relative-path rule. */
export class PathError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.PathInvalid, message, options);
        this.name = 'PathError';
    }
}
