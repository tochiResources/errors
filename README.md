# @tochii/errors

Shared typed errors and stable error codes used in official tochiResources proejcts.

- **Stable codes**: the string value is part of the contract; never reuse or rename one. Both TS and C# switch on it.
- **Typed classes**: `instanceof ConfigError`, `instanceof IpcError`, per domain, all extending `TochiResError`.
- **Serializable**: `serializeError` / `deserializeError` move errors across JSON-RPC unchanged (message, code, context, cause chain).
- **Context**: every error can carry structured `context` for logging/telemetry.

## Projects using @tochii/errors

- [AeToOsb](https://github.com/tochiResources/AeToOsb)
- [AeBrew](https://github.com/tochiResources/AeBrew)
- [osu! Storyboarding toolkit](https://github.com/tochiResources/osb-toolkit)
- [tochiResources Adobe CEP](https://github.com/tochiResources/cep)

## Usage

```ts
import { ConfigError, ErrorCode, isTochiResError, serializeError } from '@tochii/errors';

try {
    throw new ConfigError('app.name is required', {
        code: ErrorCode.ConfigMissing,
        context: { field: 'name' },
    });
} catch (error) {
    if (isTochiResError(error)) {
        console.error(error.code, error.message, error.context);
        socket.send(JSON.stringify(serializeError(error)));
    }
}
```

## Development

- **node 22.5+**, **yarn 4**, **vitest 5**, **tsdown**

```sh
yarn install
yarn build
yarn lint
yarn typecheck
yarn test
```

## License

MIT. See [LICENSE](/LICENSE).
