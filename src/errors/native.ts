import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A native module or method was missing, or a native call failed. */
export class NativeError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.NativeCallFailed, message, options);
        this.name = 'NativeError';
    }
}
