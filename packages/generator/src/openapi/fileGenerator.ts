import fs from "fs";
import Handlebars from "handlebars";
import { camelCase, groupBy } from "lodash";
import path from "path";
import type { Project } from "ts-morph";
import { getRelativePath, pascalCase } from "../helpers";
import { createProgressBar } from "../progressBar";
import type Endpoint from "./models/endpoint";
import Enum from "./models/enum";
import InheritedEntity from "./models/inheritedEntity";
import ObjectEntity from "./models/objectEntity";
import type TypeReference from "./models/typeReference";
import UnionEntity from "./models/unionEntity";
import type { IConfig, IGeneratorParams } from "./types";
import EnumWriter from "./writers/enumWriter";
import ObjectEntityWriter from "./writers/objectEntityWriter";
import RepositoryWriter from "./writers/repositoryWriter";
import StringLiteralWriter from "./writers/stringLiteralWriter";
import UnionEntityWriter from "./writers/unionEntityWriter";

export default class FileGenerator {
  constructor(private project: Project, private params: IGeneratorParams, private config: IConfig) {
    this.initTemplates();
  }

  private initTemplates() {
    Handlebars.registerHelper({
      camelCase: (x: string) => camelCase(x),
      pascalCase: (x: string) => pascalCase(x),
      rawText: (x: string) => x,
      and: (...args) => Array.prototype.every.call(args, Boolean),
      or: (...args) => Array.prototype.slice.call(args, 0, -1).some(Boolean),
    });
  }

  async generateEntities(items: TypeReference[]) {
    if (!this.config.entitiesPath) {
      return;
    }

    const progress = createProgressBar("Generating entities");
    const saveSteps = Math.ceil(items.length * 0.1 + 1);
    progress.start(1 + items.length + saveSteps, 0);

    const templates = {
      enumEntity: await this.readTemplate("enumEntity"),
      enumEntityFile: await this.readTemplate("enumEntityFile"),
      objectEntityContent: await this.readTemplate("objectEntityContent"),
      objectEntityFile: await this.readTemplate("objectEntityFile"),
      stringLiteralEntity: await this.readTemplate("stringLiteralEntity"),
      stringLiteralEntityFile: await this.readTemplate("stringLiteralEntityFile"),
      unionEntity: await this.readTemplate("unionEntity"),
      unionEntityFile: await this.readTemplate("unionEntityFile"),
    };

    Handlebars.registerPartial("generatedEntityHeader", await this.readTemplate("generatedEntityHeader"));

    const directory = this.project.createDirectory(this.config.entitiesPath);
    const enumWriter =
      this.config.enums === "enum" ? new EnumWriter(directory, templates) : new StringLiteralWriter(directory, templates);
    const objectWriter = new ObjectEntityWriter(directory, this.config, templates);
    const unionWriter = new UnionEntityWriter(directory, templates);

    progress.increment(1);

    for (const { type } of items) {
      if (type instanceof Enum) {
        enumWriter.write(type);
      } else if (type instanceof InheritedEntity) {
        const baseEntity = type.baseEntities.map(x => x.type).filter(x => x instanceof ObjectEntity)[0] as ObjectEntity;
        objectWriter.write(type, baseEntity);
      } else if (type instanceof ObjectEntity) {
        objectWriter.write(type);
      } else if (type instanceof UnionEntity) {
        unionWriter.write(type);
      }
      // we can ignore AliasEntity because it is inlined

      progress.increment();
    }

    await this.project.save();
    progress.increment(saveSteps);

    progress.stop();
  }

  async generateRepositories(endpoints: Endpoint[]) {
    if (!this.config.repositoriesPath) {
      return;
    }

    const repositories = Object.entries(groupBy(endpoints, x => x.repository));

    const progress = createProgressBar("Generating repositories");
    const saveSteps = Math.ceil(repositories.length * 0.1 + 1);
    progress.start(1 + repositories.length + saveSteps, 0);

    const templates = {
      repositoryAction: await this.readTemplate("repositoryAction"),
      repositoryFile: await this.readTemplate("repositoryFile"),
    };

    const directory = this.project.createDirectory(this.config.repositoriesPath);
    const writer = new RepositoryWriter(
      directory,
      {
        entitiesRelativePath: getRelativePath(this.config.repositoriesPath, this.config.entitiesPath),
      },
      templates
    );

    progress.increment(1);

    for (const [name, actions] of repositories) {
      writer.write(name, actions);

      progress.increment();
    }

    await this.project.save();
    progress.increment(saveSteps);

    progress.stop();
  }

  private async readTemplate<TContext = unknown>(name: string) {
    const filePath = this.config.templates[name];

    if (!filePath) {
      return Handlebars.compile<TContext>(`// missing template ${name}`);
    }

    const fullPath = filePath.startsWith("@")
      ? path.resolve(__dirname, filePath.replace("@", "./templates/"))
      : path.resolve(process.cwd(), filePath);

    const file = await fs.promises.readFile(fullPath);
    return Handlebars.compile<TContext>(file.toString());
  }
}
