import { TochiResError } from '../base.js';
import { ErrorCode } from '../codes.js';
import type { DomainErrorOptions } from './options.js';

/** An IPC transport, protocol, authentication or timeout failure. */
export class IpcError extends TochiResError {
    constructor(message: string, options: DomainErrorOptions = {}) {
        super(options.code ?? ErrorCode.IpcTransport, message, options);
        this.name = 'IpcError';
    }
}
