import type { TochiResErrorOptions } from '../base.js';
import type { ErrorCode } from '../codes.js';

/** Options shared by every domain error class (adds an optional code override). */
export interface DomainErrorOptions extends TochiResErrorOptions {
    /** Override the class's default code. */
    code?: ErrorCode;
}
