import type { TochiResError } from '../base.js';
import { categoryOf, type ErrorCategory, type ErrorCode } from '../codes.js';
import { ApiError } from './api.js';
import { BuildError } from './build.js';
import { CodegenError } from './codegen.js';
import { ConfigError } from './config.js';
import { CssError } from './css.js';
import { IpcError } from './ipc.js';
import { NativeError } from './native.js';
import type { DomainErrorOptions } from './options.js';
import { PackageError } from './package.js';
import { PathError } from './path.js';
import { SettingsError } from './settings.js';
import { ValidationError } from './validation.js';

export { ApiError } from './api.js';
export { BuildError } from './build.js';
export { CodegenError } from './codegen.js';
export { ConfigError } from './config.js';
export { CssError } from './css.js';
export { IpcError } from './ipc.js';
export { NativeError } from './native.js';
export type { DomainErrorOptions } from './options.js';
export { PackageError } from './package.js';
export { PathError } from './path.js';
export { SettingsError } from './settings.js';
export { ValidationError } from './validation.js';

/** Constructor shape shared by every domain error class. */
export type DomainErrorConstructor = new (
    message: string,
    options?: DomainErrorOptions
) => TochiResError;

const CLASS_BY_CATEGORY: Record<Exclude<ErrorCategory, 'general'>, DomainErrorConstructor> = {
    config: ConfigError,
    validation: ValidationError,
    api: ApiError,
    ipc: IpcError,
    codegen: CodegenError,
    css: CssError,
    native: NativeError,
    build: BuildError,
    package: PackageError,
    settings: SettingsError,
    path: PathError,
};

/**
 * The domain error class responsible for a code, or `undefined` for generic
 * codes (which use {@link TochiResError} directly).
 */
export function errorClassFor(code: ErrorCode): DomainErrorConstructor | undefined {
    const category = categoryOf(code);
    return category === 'general' ? undefined : CLASS_BY_CATEGORY[category];
}
