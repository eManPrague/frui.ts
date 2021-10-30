#!/usr/bin/env node
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { program } from "commander";
import PackageInfo from "../package.json";
import type { IGeneratorParams } from "./inversify/types";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
program.name("fruits-generate").version(PackageInfo.version).description(PackageInfo.description);
program
  .command("inversify")
  .description("Generate Inversify configuration files")
  .option("-p, --project <fileName>", "TS project file", "./tsconfig.json")
  .option("-c, --config <fileName>", "Custom configuration file")
  .option("-d, --debug", "Output extra debugging")
  .option("--no-decorators", "Do not generate decorators file")
  .option("--decorators-output <relativePath>", "Decorators output file path", "src/di.decorators.ts")
  .option("--no-registry", "Do not generate registry file")
  .option("--registry-output <relativePath>", "Registry output file path", "src/di.registry.ts")

  .action(async options => {
    const params: IGeneratorParams = {
      project: options.project,
      config: options.config,
      debug: options.debug,
    };

    if (options.decorators) {
      params.decorators = { output: options.decoratorsOutput };
    }
    if (options.registry) {
      params.registry = { output: options.registryOutput };
    }

    const GeneratorType = await import("./inversify");
    const generator = new GeneratorType.default(params);
    await generator.init();
    await generator.run();
  });

program
  .command("views")
  .description("Generate view registrations")
  .option("-p, --project <fileName>", "TS project file", "./tsconfig.json")
  .option("-d, --debug", "Output extra debugging")
  .option("-o, --output <relativePath>", "Output file path", "src/views/index.ts")
  .action(async options => {
    const params = {
      project: options.project,
      config: options.config,
      output: options.output,
      debug: options.debug,
    };

    const GeneratorType = await import("./views");
    const generator = new GeneratorType.default(params);
    await generator.init();
    await generator.run();
  });

program
  .command("openapi")
  .alias("swagger")
  .description("Generate OpenAPI client files")
  .option("-p, --project <fileName>", "TS project file", "./tsconfig.json")
  .option("-c, --config <fileName>", "Custom configuration file")
  .option("-d, --debug", "Output extra debugging")
  .option("-o, --output <relativePath>", "Output folder path", "src/entities")
  .option("--no-validation", "Do not generate validation rules")
  .option("--no-conversion", "Do not generate conversion function")
  .action(async options => {
    const params = {
      project: options.project,
      config: options.config,
      outputFolder: options.output,
      generateValidation: options.validation,
      generateConversion: options.conversion,
      debug: options.debug,
    };

    const GeneratorType = await import("./openapi");
    const generator = new GeneratorType.default(params);
    await generator.init();
    await generator.run();
  });

program.parse();
