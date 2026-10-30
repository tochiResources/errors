import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** An API/HTTP boundary failure (bad request, auth, not found, conflict, …). */
export class ApiError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.ApiBadRequest, message, options);
        this.name = 'ApiError';
    }
}
