import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** A TS→C# code generator failed or hit an unsupported construct. */
export class CodegenError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.CodegenEmit, message, options);
        this.name = 'CodegenError';
    }
}
