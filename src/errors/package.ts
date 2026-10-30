import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A packaging, signing or notarization step failed. */
export class PackageError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.PackageFailed, message, options);
        this.name = 'PackageError';
    }
}
