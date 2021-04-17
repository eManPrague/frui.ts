import { groupBy } from "lodash";
import { Project } from "ts-morph";
import { getRelativePath } from "../helpers";
import { createProgressBar } from "../progressBar";
import Endpoint from "./models/endpoint";
import Enum from "./models/enum";
import InheritedEntity from "./models/inheritedEntity";
import ObjectEntity from "./models/objectEntity";
import TypeReference from "./models/typeReference";
import UnionEntity from "./models/unionEntity";
import { IConfig, IGeneratorParams } from "./types";
import EnumWriter from "./writers/enumWriter";
import ObjectEntityWriter from "./writers/objectEntityWriter";
import RepositoryWriter from "./writers/repositoryWriter";
import StringLiteralWriter from "./writers/stringLiteralWriter";
import UnionEntityWriter from "./writers/unionEntityWriter";

export default class FileGenerator {
  constructor(private project: Project, private params: IGeneratorParams, private config: IConfig) {}

  async generateEntities(items: TypeReference[]) {
    if (!this.config.entitiesPath) {
      return;
    }

    const progress = createProgressBar("Generating entities");
    const saveSteps = Math.ceil(items.length * 0.1 + 1);
    progress.start(1 + items.length + saveSteps, 0);

    const directory = this.project.createDirectory(this.config.entitiesPath);
    const enumWriter = this.config.enums === "enum" ? new EnumWriter(directory) : new StringLiteralWriter(directory);
    const objectWriter = new ObjectEntityWriter(directory, this.params, this.config);
    const unionWriter = new UnionEntityWriter(directory);

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

    const directory = this.project.createDirectory(this.config.repositoriesPath);

    // TODO load templates

    const writer = new RepositoryWriter(directory, {
      entitiesRelativePath: getRelativePath(this.config.repositoriesPath, this.config.entitiesPath),
    });

    progress.increment(1);

    for (const [name, actions] of repositories) {
      writer.write(name, actions);

      progress.increment();
    }

    await this.project.save();
    progress.increment(saveSteps);

    progress.stop();
  }
}
