using System;
using System.Collections.Generic;

namespace TochiRes.Errors;

/// <summary>
/// Stable error codes shared with the TypeScript side (<c>@tochii/errors</c>).
/// Keep in sync with <c>src/codes.ts</c>. A code is part of the
/// public contract: never rename or reuse one — add a new code instead.
/// </summary>
public static class ErrorCodes
{
    // General
    public const string Unknown = "TOCHIRES_UNKNOWN";
    public const string Internal = "TOCHIRES_INTERNAL";

    // Config
    public const string ConfigInvalid = "TOCHIRES_CONFIG_INVALID";
    public const string ConfigMissing = "TOCHIRES_CONFIG_MISSING";

    // Validation
    public const string ValidationFailed = "TOCHIRES_VALIDATION_FAILED";

    // API / HTTP boundary
    public const string ApiBadRequest = "TOCHIRES_API_BAD_REQUEST";
    public const string ApiUnauthorized = "TOCHIRES_API_UNAUTHORIZED";
    public const string ApiForbidden = "TOCHIRES_API_FORBIDDEN";
    public const string ApiNotFound = "TOCHIRES_API_NOT_FOUND";
    public const string ApiConflict = "TOCHIRES_API_CONFLICT";
    public const string ApiUnprocessable = "TOCHIRES_API_UNPROCESSABLE";
    public const string ApiTooManyRequests = "TOCHIRES_API_TOO_MANY_REQUESTS";
    public const string ApiTimeout = "TOCHIRES_API_TIMEOUT";
    public const string ApiUnavailable = "TOCHIRES_API_UNAVAILABLE";

    // IPC
    public const string IpcTransport = "TOCHIRES_IPC_TRANSPORT";
    public const string IpcProtocol = "TOCHIRES_IPC_PROTOCOL";
    public const string IpcTimeout = "TOCHIRES_IPC_TIMEOUT";
    public const string IpcAuth = "TOCHIRES_IPC_AUTH";
    public const string IpcDisconnected = "TOCHIRES_IPC_DISCONNECTED";
    public const string IpcBackpressure = "TOCHIRES_IPC_BACKPRESSURE";

    // Codegen
    public const string CodegenUnsupported = "TOCHIRES_CODEGEN_UNSUPPORTED";
    public const string CodegenEmit = "TOCHIRES_CODEGEN_EMIT";
    public const string CodegenRoundtrip = "TOCHIRES_CODEGEN_ROUNDTRIP";

    // CSS
    public const string CssParse = "TOCHIRES_CSS_PARSE";
    public const string CssUnsupportedProperty = "TOCHIRES_CSS_UNSUPPORTED_PROPERTY";
    public const string CssUnsupportedSelector = "TOCHIRES_CSS_UNSUPPORTED_SELECTOR";

    // Native
    public const string NativeModuleNotFound = "TOCHIRES_NATIVE_MODULE_NOT_FOUND";
    public const string NativeMethodNotFound = "TOCHIRES_NATIVE_METHOD_NOT_FOUND";
    public const string NativeCallFailed = "TOCHIRES_NATIVE_CALL_FAILED";

    // Build
    public const string BuildFailed = "TOCHIRES_BUILD_FAILED";
    public const string BuildToolMissing = "TOCHIRES_BUILD_TOOL_MISSING";

    // Package
    public const string PackageFailed = "TOCHIRES_PACKAGE_FAILED";
    public const string PackageSigning = "TOCHIRES_PACKAGE_SIGNING";

    // Settings
    public const string SettingsParse = "TOCHIRES_SETTINGS_PARSE";
    public const string SettingsInvalid = "TOCHIRES_SETTINGS_INVALID";

    // Path
    public const string PathInvalid = "TOCHIRES_PATH_INVALID";
    public const string PathAbsolute = "TOCHIRES_PATH_ABSOLUTE";

    /// <summary>Every known code, for validation and diagnostics.</summary>
    public static readonly IReadOnlyList<string> All = new[]
    {
        Unknown, Internal,
        ConfigInvalid, ConfigMissing,
        ValidationFailed,
        ApiBadRequest, ApiUnauthorized, ApiForbidden, ApiNotFound, ApiConflict,
        ApiUnprocessable, ApiTooManyRequests, ApiTimeout, ApiUnavailable,
        IpcTransport, IpcProtocol, IpcTimeout, IpcAuth, IpcDisconnected, IpcBackpressure,
        CodegenUnsupported, CodegenEmit, CodegenRoundtrip,
        CssParse, CssUnsupportedProperty, CssUnsupportedSelector,
        NativeModuleNotFound, NativeMethodNotFound, NativeCallFailed,
        BuildFailed, BuildToolMissing,
        PackageFailed, PackageSigning,
        SettingsParse, SettingsInvalid,
        PathInvalid, PathAbsolute,
    };

    private static readonly IReadOnlyDictionary<string, string> CategoryByCode =
        new Dictionary<string, string>(StringComparer.Ordinal)
        {
            [Unknown] = "general",
            [Internal] = "general",
            [ConfigInvalid] = "config",
            [ConfigMissing] = "config",
            [ValidationFailed] = "validation",
            [ApiBadRequest] = "api",
            [ApiUnauthorized] = "api",
            [ApiForbidden] = "api",
            [ApiNotFound] = "api",
            [ApiConflict] = "api",
            [ApiUnprocessable] = "api",
            [ApiTooManyRequests] = "api",
            [ApiTimeout] = "api",
            [ApiUnavailable] = "api",
            [IpcTransport] = "ipc",
            [IpcProtocol] = "ipc",
            [IpcTimeout] = "ipc",
            [IpcAuth] = "ipc",
            [IpcDisconnected] = "ipc",
            [IpcBackpressure] = "ipc",
            [CodegenUnsupported] = "codegen",
            [CodegenEmit] = "codegen",
            [CodegenRoundtrip] = "codegen",
            [CssParse] = "css",
            [CssUnsupportedProperty] = "css",
            [CssUnsupportedSelector] = "css",
            [NativeModuleNotFound] = "native",
            [NativeMethodNotFound] = "native",
            [NativeCallFailed] = "native",
            [BuildFailed] = "build",
            [BuildToolMissing] = "build",
            [PackageFailed] = "package",
            [PackageSigning] = "package",
            [SettingsParse] = "settings",
            [SettingsInvalid] = "settings",
            [PathInvalid] = "path",
            [PathAbsolute] = "path",
        };

    /// <summary>Whether <paramref name="code"/> is one of the known stable codes.</summary>
    public static bool IsKnown(string? code) => code is not null && CategoryByCode.ContainsKey(code);

    /// <summary>The category a code belongs to, or <c>"general"</c> when unknown.</summary>
    public static string CategoryOf(string? code) =>
        code is not null && CategoryByCode.TryGetValue(code, out var category) ? category : "general";
}

/// <summary>
/// Base exception for every error defined by this package.
/// Mirrors <c>TochiResError</c> from the TypeScript implementation.
/// </summary>
public class TochiResException : Exception
{
    /// <summary>Stable error code — part of the public contract.</summary>
    public string Code { get; }

    /// <summary>Coarse category derived from <see cref="Code"/>.</summary>
    public string Category { get; }

    /// <summary>Structured, JSON-safe context for logging and telemetry.</summary>
    public IReadOnlyDictionary<string, object?>? Context { get; }

    public TochiResException(
        string code,
        string message,
        Exception? innerException = null,
        IReadOnlyDictionary<string, object?>? context = null)
        : base(message, innerException)
    {
        Code = code;
        Category = ErrorCodes.CategoryOf(code);
        Context = context;
    }
}

/// <summary>Configuration is missing or failed validation.</summary>
public sealed class ConfigException : TochiResException
{
    public ConfigException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.ConfigInvalid, message, inner, context) { }

    public ConfigException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A payload, schema or argument failed validation.</summary>
public sealed class ValidationException : TochiResException
{
    public ValidationException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.ValidationFailed, message, inner, context) { }
}

/// <summary>An API/HTTP boundary failure (bad request, auth, not found, conflict, …).</summary>
public sealed class ApiException : TochiResException
{
    public ApiException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.ApiBadRequest, message, inner, context) { }

    public ApiException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>An IPC transport, protocol, authentication or timeout failure.</summary>
public sealed class IpcException : TochiResException
{
    public IpcException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.IpcTransport, message, inner, context) { }

    public IpcException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A TS→C# code generator failed or hit an unsupported construct.</summary>
public sealed class CodegenException : TochiResException
{
    public CodegenException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.CodegenEmit, message, inner, context) { }

    public CodegenException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>CSS input is invalid or outside the supported subset.</summary>
public sealed class CssException : TochiResException
{
    public CssException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.CssParse, message, inner, context) { }

    public CssException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A native module or method was missing, or a native call failed.</summary>
public sealed class NativeException : TochiResException
{
    public NativeException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.NativeCallFailed, message, inner, context) { }

    public NativeException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A build pipeline step failed or a required tool is missing.</summary>
public sealed class BuildException : TochiResException
{
    public BuildException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.BuildFailed, message, inner, context) { }

    public BuildException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A packaging, signing or notarization step failed.</summary>
public sealed class PackageException : TochiResException
{
    public PackageException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.PackageFailed, message, inner, context) { }

    public PackageException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>Settings text could not be parsed or failed validation.</summary>
public sealed class SettingsException : TochiResException
{
    public SettingsException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.SettingsInvalid, message, inner, context) { }

    public SettingsException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}

/// <summary>A path was malformed or violated the relative-path rule.</summary>
public sealed class PathException : TochiResException
{
    public PathException(string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(ErrorCodes.PathInvalid, message, inner, context) { }

    public PathException(string code, string message, Exception? inner = null, IReadOnlyDictionary<string, object?>? context = null)
        : base(code, message, inner, context) { }
}
