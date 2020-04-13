#!/usr/bin/env node
import { program } from "commander";
import { BaseParams } from "./generatorBase";

program.version("0.1.0").description("Frui.ts Generator");

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
    generator.run();
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
    generator.run();
  });

program.parse(process.argv);
