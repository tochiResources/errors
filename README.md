# @tochii/errors

[![tests](https://img.shields.io/github/actions/workflow/status/tochiResources/errors/ci.yml?label=tests&logo=github)](https://github.com/tochiResources/errors/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@tochii/errors.svg?color=cb3837&label=npm)](https://www.npmjs.com/package/@tochii/errors)
[![NuGet Version](https://img.shields.io/nuget/vpre/TochiRes.Errors?color=0956cc&label=NuGet)](https://www.nuget.org/packages/TochiRes.Errors)

Shared typed errors and stable error codes used in official `tochiResources` projects.

## Projects using @tochii/errors

- [AeToOsb](https://github.com/tochiResources/AeToOsb)
- [AeBrew](https://github.com/tochiResources/AeBrew)
- [osu! Storyboarding Toolkit](https://github.com/tochiResources/osb-toolkit)
- [tochiResources Adobe CEP](https://github.com/tochiResources/cep)

## Installation

### JS/TS

```sh
npm install @tochii/errors
```

Or with another package manager:

```sh
pnpm add @tochii/errors
yarn add @tochii/errors
bun add @tochii/errors
```

### C#

```sh
dotnet add package TochiRes.Errors
```

Or add it directly to the project file:

```xml
<PackageReference Include="TochiRes.Errors" Version="<nuget-version>" />
```

## Usage

### JS/TS

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

### C#

```csharp
using System;
using System.Collections.Generic;
using TochiRes.Errors;

try
{
    throw new ConfigException(
        ErrorCodes.ConfigMissing,
        "app.name is required",
        context: new Dictionary<string, object?> { ["field"] = "name" });
}
catch (TochiResException error)
{
    Console.Error.WriteLine($"{error.Code} ({error.Category}): {error.Message}");

    if (error.Context is not null)
    {
        Console.Error.WriteLine($"context: {error.Context}");
    }
}
```

## Development

### Requirements

- **Node.js** 22.5+
- **Yarn** 4
- **.NET SDK** 8+ (10.x is used in CI for the C# package)

### Scrips

```sh
yarn install
yarn build
yarn lint
yarn typecheck
yarn test
```

## License

MIT. See [LICENSE](/LICENSE).
