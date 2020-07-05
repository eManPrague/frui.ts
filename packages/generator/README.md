# Frui.ts code generator

Provides code generation for:

- [Inversify registrauion](#Inversify-configuration)
- [Views registration](#Views-registration)
- [OpenAPI entities](#OpenApi-entities)

## Inversify configuration

Generates files needed for [InversifyJS](https://github.com/inversify/InversifyJS) DI container:

- A 'decorators' file with `@injectable` and `@inject` decorators so that you don't need to write them in your code.
- A 'registry' file with `container.bind()` statements.

Following service export scenarios are supported:

- No constructor
- Custom constructor with parameters
- Static factory method

Dependency injection scenarios supported:

- Constructor parameters:
  - instance (`constructor(dependecy: SomeService)`)
  - custom static factory method (`constructor(dependecyFactory: ReturnType<typeof SomeService.Factory>)`)
  - automatic factory method (`constructor(dependecyFactory: () => SomeService)`)

### Usage

```console
Usage: fruits-generate inversify [options]

Generate Inversify configuration files

Options:
  -p, --project <fileName>            TS project file (default: "./tsconfig.json")
  -c, --config <fileName>             Custom configuration file
  --no-decorators                     Do not generate decorators file
  --decorators-output <relativePath>  Decorators output file path (default: "src/di.decorators.ts")
  --no-registry                       Do not generate registry file
  --registry-output <relativePath>    Registry output file path (default: "src/di.registry.ts")
  -h, --help                          display help for command
```

Custom configuration is expected to be a JSON file with the following structure:

```ts
export interface IConfig {
  factoryName: string;
  rules: {
    pattern: string;
    addDecorators?: boolean;
    registerAutoFactory?: boolean;
    scope: "none" | "singleton" | "transient";
    identifier?: "$class" | "$interface" | string;
  }[];
}
```

Use `none` life scope if you don't want the service registered but still want the decorators generated. This is useful if you want to register the service yourself.

`Identifier` determines what service identifier shall be used when registering the service:

- `$class` - the class constructor will be used (default)
- `$interface` - name of the first interface that the service implements will be used
- any other key - the key will be used as a string

Default configuration file:

```json
{
  "factoryName": "Factory",
  "rules": [
    {
      "pattern": "Service$",
      "identifier": "$class",
      "addDecorators": true,
      "registerAutoFactory": false,
      "scope": "singleton"
    },
    {
      "pattern": "ViewModel$",
      "identifier": "$class",
      "addDecorators": true,
      "registerAutoFactory": false,
      "scope": "transient"
    },
    {
      "pattern": "Repository$",
      "identifier": "$class",
      "addDecorators": true,
      "registerAutoFactory": false,
      "scope": "transient"
    }
  ]
}
```

### Example

With these classes:

```ts
export default class AService {}
```

```ts
import { interfaces } from "inversify";

export default class BService {
  // serviceA shall be injected from DI
  // someParam must be provided when instantiating
  constructor(private serviceA: AService, someParam: any) {}

  static Factory({ container }: interfaces.Context) {
    return (someParam: any) => new BService(container.get(AService), someParam);
  }
}
```

```ts
export default class CService {
  constructor(serviceBFactory: ReturnType<typeof BService.Factory>) {
    const serviceB = serviceBFactory("someParam");
  }
}
```

The following files will be generated:

```ts
// di.decorators.ts
import { decorate, inject, injectable } from "inversify";
decorate(injectable(), AService);
decorate(injectable(), BService);
decorate(injectable(), CService);

decorate(inject(BService.Factory) as any, CService, 0);
```

```ts
// di.registry.ts
import { Container, interfaces } from "inversify";
export default function registerServices(container: Container) {
  container.bind<AService>(AService).toSelf().inSingletonScope();
  container.bind<interfaces.Factory<BService>>(BService.Factory).toFactory(BService.Factory);
  container.bind<CService>(CService).toSelf().inSingletonScope();
}
```

## Views registration

Generates a file referencing all Frui.ts views that call `registerView()` from the `@frui.ts/views` package. Therefore you just need to import this single generated file, and all your views will be registered.

### Usage

```console
Usage: fruits-generate views [options]

Generate view registrations

Options:
  -p, --project <fileName>     TS project file (default: "./tsconfig.json")
  -o, --output <relativePath>  Output file path (default: "src/views/index.ts")
  -h, --help                   display help for command
```

## OpenApi entities

Generates typescript entities defined in the referenced OpenAPI definition. The entities also contain validation rules as defined in the OpenAPI definition and static function for conversion from JSON format (e.g., string->Date).

Note that if the file already exists during generation, only the class' body is regenerated. For example, you can remove the `export default` part or add custom code to the file.

### Usage

```console
Usage: fruits-generate openapi|swagger [options]

Generate OpenAPI client files

Options:
  -p, --project <fileName>     TS project file (default: "./tsconfig.json")
  -c, --config <fileName>      Custom configuration file
  -o, --output <relativePath>  Output folder path (default: "src/entities")
  --no-validation              Do not generate validation rules
  --no-conversion              Do not generate conversion function
  -h, --help                   display help for command
```

Custom configuration is expected to be a JSON file with the following structure:

```ts
export interface IConfig {
  api: string;
}
```

Default configuration file:

```json
{
  "api": "https://fruits-demo.herokuapp.com/api/swagger-json"
}
```

### Example

Generated file

```ts
export default class User {
  id!: number;
  email!: string;
  createdAt!: Date;
  updatedAt?: Date;
  role!: number;

  static ValidationRules = {
    id: { required: true },
    email: { required: true, maxLength: 250 },
    createdAt: { required: true },
    role: { required: true },
  };

  static fromJson(user: User) {
    user.createdAt = new Date(user.createdAt);
    user.updatedAt = !!user.updatedAt ? new Date(user.updatedAt) : undefined;
  }
}
```
