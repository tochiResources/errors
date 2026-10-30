import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A build pipeline step failed or a required tool is missing. */
export class BuildError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.BuildFailed, message, options);
        this.name = 'BuildError';
    }
}
