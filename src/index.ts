export { serializeCause, TochiResError, type TochiResErrorOptions } from './base.js';
export { categoryOf, ERROR_CODES, type ErrorCategory, ErrorCode, isErrorCode } from './codes.js';
export {
    ApiError,
    BuildError,
    CodegenError,
    ConfigError,
    CssError,
    type DomainErrorConstructor,
    type DomainErrorOptions,
    errorClassFor,
    IpcError,
    NativeError,
    PackageError,
    PathError,
    SettingsError,
    ValidationError,
} from './errors/index.js';
export { assertTochiRes, hasErrorCode, isTochiResError, toTochiResError } from './guard.js';
export { deserializeError, isSerializedError, serializeError } from './serialize.js';
export type { SerializedError } from './types.js';
