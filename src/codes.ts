/**
 * Stable error codes shared by the TypeScript and C# implementations.
 *
 * A code is part of the public contract: it is persisted in logs, sent across
 * the JSON-RPC boundary and switched on by consumers (including the C# mirror
 * in `Errors.cs`).
 * Never rename or reuse a code — add a new one and deprecate the old.
 */
export const ErrorCode = {
    /** An error that could not be classified. */
    Unknown: 'TOCHIRES_UNKNOWN',
    /** An invariant inside the library was violated. */
    Internal: 'TOCHIRES_INTERNAL',

    /** A configuration object failed validation. */
    ConfigInvalid: 'TOCHIRES_CONFIG_INVALID',
    /** A required configuration field is missing. */
    ConfigMissing: 'TOCHIRES_CONFIG_MISSING',

    /** A generic validation failure (payload, schema, argument). */
    ValidationFailed: 'TOCHIRES_VALIDATION_FAILED',

    /** The request was malformed or failed validation at an API boundary. */
    ApiBadRequest: 'TOCHIRES_API_BAD_REQUEST',
    /** Authentication is required, or the session/token is invalid. */
    ApiUnauthorized: 'TOCHIRES_API_UNAUTHORIZED',
    /** The authenticated principal is not allowed to perform the action. */
    ApiForbidden: 'TOCHIRES_API_FORBIDDEN',
    /** The requested resource does not exist. */
    ApiNotFound: 'TOCHIRES_API_NOT_FOUND',
    /** The request conflicts with the current state of the resource. */
    ApiConflict: 'TOCHIRES_API_CONFLICT',
    /** The payload was well-formed but is semantically invalid. */
    ApiUnprocessable: 'TOCHIRES_API_UNPROCESSABLE',
    /** The caller exceeded an imposed rate limit. */
    ApiTooManyRequests: 'TOCHIRES_API_TOO_MANY_REQUESTS',
    /** An upstream dependency did not respond in time. */
    ApiTimeout: 'TOCHIRES_API_TIMEOUT',
    /** A downstream dependency is unavailable. */
    ApiUnavailable: 'TOCHIRES_API_UNAVAILABLE',

    /** The IPC transport could not be opened or used. */
    IpcTransport: 'TOCHIRES_IPC_TRANSPORT',
    /** A JSON-RPC envelope was malformed or violated the protocol. */
    IpcProtocol: 'TOCHIRES_IPC_PROTOCOL',
    /** A request did not receive a response in time. */
    IpcTimeout: 'TOCHIRES_IPC_TIMEOUT',
    /** Token authentication failed. */
    IpcAuth: 'TOCHIRES_IPC_AUTH',
    /** The peer disconnected before the operation completed. */
    IpcDisconnected: 'TOCHIRES_IPC_DISCONNECTED',
    /** A stream was paused because the consumer fell behind. */
    IpcBackpressure: 'TOCHIRES_IPC_BACKPRESSURE',

    /** A TypeScript construct has no C# codegen mapping. */
    CodegenUnsupported: 'TOCHIRES_CODEGEN_UNSUPPORTED',
    /** A generator failed while emitting an artifact. */
    CodegenEmit: 'TOCHIRES_CODEGEN_EMIT',
    /** Generated output did not round-trip back to its source. */
    CodegenRoundtrip: 'TOCHIRES_CODEGEN_ROUNDTRIP',

    /** CSS input could not be parsed. */
    CssParse: 'TOCHIRES_CSS_PARSE',
    /** A CSS property is outside the supported subset. */
    CssUnsupportedProperty: 'TOCHIRES_CSS_UNSUPPORTED_PROPERTY',
    /** A CSS selector is outside the supported subset. */
    CssUnsupportedSelector: 'TOCHIRES_CSS_UNSUPPORTED_SELECTOR',

    /** A native module was not registered on the C# host. */
    NativeModuleNotFound: 'TOCHIRES_NATIVE_MODULE_NOT_FOUND',
    /** A native method was not registered on a module. */
    NativeMethodNotFound: 'TOCHIRES_NATIVE_METHOD_NOT_FOUND',
    /** A native method threw or returned an error. */
    NativeCallFailed: 'TOCHIRES_NATIVE_CALL_FAILED',

    /** A build pipeline step failed. */
    BuildFailed: 'TOCHIRES_BUILD_FAILED',
    /** A required build tool (dotnet, esbuild, …) is unavailable. */
    BuildToolMissing: 'TOCHIRES_BUILD_TOOL_MISSING',

    /** A packaging step failed. */
    PackageFailed: 'TOCHIRES_PACKAGE_FAILED',
    /** Signing or notarization failed. */
    PackageSigning: 'TOCHIRES_PACKAGE_SIGNING',

    /** Settings text could not be parsed. */
    SettingsParse: 'TOCHIRES_SETTINGS_PARSE',
    /** Settings values failed validation against their spec. */
    SettingsInvalid: 'TOCHIRES_SETTINGS_INVALID',

    /** A path was malformed. */
    PathInvalid: 'TOCHIRES_PATH_INVALID',
    /** An absolute path was supplied where only relative paths are allowed. */
    PathAbsolute: 'TOCHIRES_PATH_ABSOLUTE',
} as const;

/** Union of every stable error code. */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Coarse grouping used for reporting, filtering and C# exception types. */
export type ErrorCategory =
    | 'general'
    | 'config'
    | 'validation'
    | 'api'
    | 'ipc'
    | 'codegen'
    | 'css'
    | 'native'
    | 'build'
    | 'package'
    | 'settings'
    | 'path';

const CATEGORY_BY_CODE: Record<ErrorCode, ErrorCategory> = {
    [ErrorCode.Unknown]: 'general',
    [ErrorCode.Internal]: 'general',

    [ErrorCode.ConfigInvalid]: 'config',
    [ErrorCode.ConfigMissing]: 'config',

    [ErrorCode.ValidationFailed]: 'validation',

    [ErrorCode.ApiBadRequest]: 'api',
    [ErrorCode.ApiUnauthorized]: 'api',
    [ErrorCode.ApiForbidden]: 'api',
    [ErrorCode.ApiNotFound]: 'api',
    [ErrorCode.ApiConflict]: 'api',
    [ErrorCode.ApiUnprocessable]: 'api',
    [ErrorCode.ApiTooManyRequests]: 'api',
    [ErrorCode.ApiTimeout]: 'api',
    [ErrorCode.ApiUnavailable]: 'api',

    [ErrorCode.IpcTransport]: 'ipc',
    [ErrorCode.IpcProtocol]: 'ipc',
    [ErrorCode.IpcTimeout]: 'ipc',
    [ErrorCode.IpcAuth]: 'ipc',
    [ErrorCode.IpcDisconnected]: 'ipc',
    [ErrorCode.IpcBackpressure]: 'ipc',

    [ErrorCode.CodegenUnsupported]: 'codegen',
    [ErrorCode.CodegenEmit]: 'codegen',
    [ErrorCode.CodegenRoundtrip]: 'codegen',

    [ErrorCode.CssParse]: 'css',
    [ErrorCode.CssUnsupportedProperty]: 'css',
    [ErrorCode.CssUnsupportedSelector]: 'css',

    [ErrorCode.NativeModuleNotFound]: 'native',
    [ErrorCode.NativeMethodNotFound]: 'native',
    [ErrorCode.NativeCallFailed]: 'native',

    [ErrorCode.BuildFailed]: 'build',
    [ErrorCode.BuildToolMissing]: 'build',

    [ErrorCode.PackageFailed]: 'package',
    [ErrorCode.PackageSigning]: 'package',

    [ErrorCode.SettingsParse]: 'settings',
    [ErrorCode.SettingsInvalid]: 'settings',

    [ErrorCode.PathInvalid]: 'path',
    [ErrorCode.PathAbsolute]: 'path',
};

/** All codes, as an array — handy for exhaustiveness checks and docs. */
export const ERROR_CODES = Object.values(ErrorCode) as ErrorCode[];

/** Whether a value is one of the known stable codes. */
export function isErrorCode(value: unknown): value is ErrorCode {
    return typeof value === 'string' && Object.hasOwn(CATEGORY_BY_CODE, value);
}

/** The category a code belongs to, or `'general'` for unknown codes. */
export function categoryOf(code: ErrorCode): ErrorCategory {
    return CATEGORY_BY_CODE[code] ?? 'general';
}
