import { SingleBar } from "cli-progress";
import fs from "fs";
import Handlebars from "handlebars";
import { camelCase, groupBy } from "lodash";
import path from "path";
import { Project } from "ts-morph";
import { pascalCase } from "../helpers";
import { createProgressBar } from "../progressBar";
import Endpoint from "./models/endpoint";
import Enum from "./models/enum";
import InheritedEntity from "./models/inheritedEntity";
import ObjectEntity from "./models/objectEntity";
import TypeReference from "./models/typeReference";
import UnionEntity from "./models/unionEntity";
import { IConfig, IGeneratorParams } from "./types";
import { patternMath } from "./utils";
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
      camelCase: x => camelCase(x),
      pascalCase: x => pascalCase(x),
      rawText: x => x,
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

    Handlebars.registerPartial("generatedEntityHeader", await this.readTemplate("generatedEntityHeader"));

    const entitiesPath = this.config.entitiesPath;
    const groups = groupBy(items, item => {
      const name = item.getTypeName() ?? "";

      if (typeof entitiesPath === "object") {
        for (const path in entitiesPath) {
          if (entitiesPath.hasOwnProperty(path)) {
            const pattern = entitiesPath[path];
            const include = patternMath(pattern, name);

            if (include) {
              return path;
            }
          }
        }
        return this.config.defaultEntitiesPath;
      } else {
        return entitiesPath;
      }
    });

    progress.increment(1);

    for (const path in groups) {
      await this.generateEntityGroup(groups[path], path, progress);
    }

    await this.project.save();
    progress.increment(saveSteps);

    progress.stop();
  }

  async generateEntityGroup(items: TypeReference[], path: string, progress: SingleBar) {
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
    const directory = this.project.createDirectory(path);

    const enumWriter =
      this.config.enums === "enum" ? new EnumWriter(directory, templates) : new StringLiteralWriter(directory, templates);
    const objectWriter = new ObjectEntityWriter(directory, this.config, templates);
    const unionWriter = new UnionEntityWriter(directory, templates);

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
    const writer = new RepositoryWriter(directory, this.config, templates);

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
    const filePath = this.config.templates?.[name];

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
