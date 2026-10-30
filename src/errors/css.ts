import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** CSS input is invalid or outside the supported subset. */
export class CssError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.CssParse, message, options);
        this.name = 'CssError';
    }
}
