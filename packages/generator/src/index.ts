#!/usr/bin/env node
/* eslint-disable @typescript-eslint/tslint/config */
import { program } from "commander";
import { BaseParams } from "./generatorBase";
import PackageInfo from "../package.json";

program.name("fruits-generate").version(PackageInfo.version).description(PackageInfo.description);

program
  .command("inversify")
  .description("Generate Inversify configuration files")
  .option("-p, --project <fileName>", "TS project file", "./tsconfig.json")
  .option("-c, --config <fileName>", "Custom configuration file")
  .option("--no-decorators", "Do not generate decorators file")
  .option("--decorators-output <relativePath>", "Decorators output file path", "src/di.decorators.ts")
  .option("--no-registry", "Do not generate registry file")
  .option("--registry-output <relativePath>", "Registry output file path", "src/di.registry.ts")

  .action(async options => {
    const params: any = {
      project: options.project,
      config: options.config,
    } as BaseParams;

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
  .option("-o, --output <relativePath>", "Output file path", "src/views/index.ts")
  .action(async options => {
    const params = {
      project: options.project,
      config: options.config,
      output: options.output,
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
    };

    const GeneratorType = await import("./openapi");
    const generator = new GeneratorType.default(params);
    await generator.init();
    await generator.run();
  });

program.parse();
