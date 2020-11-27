import { Project } from "ts-morph";
import { createProgressBar } from "../progressBar";
import Enum from "./models/enum";
import InheritedEntity from "./models/inheritedEntity";
import ObjectEntity from "./models/objectEntity";
import TypeReference from "./models/typeReference";
import UnionEntity from "./models/unionEntity";
import { IConfig, IGeneratorParams } from "./types";
import EnumWriter from "./writers/enumWriter";
import ObjectEntityWriter from "./writers/objectEntityWriter";
import StringLiteralWriter from "./writers/stringLiteralWriter";
import UnionEntityWriter from "./writers/unionEntityWriter";

export default class FileGenerator {
  constructor(private project: Project, private params: IGeneratorParams, private config: Partial<IConfig>) {}

  async generate(items: TypeReference[]) {
    const progress = createProgressBar("Generating");
    const saveSteps = Math.ceil(items.length * 0.1 + 1);
    progress.start(1 + items.length + saveSteps, 0);

    const directory = this.project.createDirectory(this.params.outputFolder);
    const enumWriter = this.config.enums === "enum" ? new EnumWriter(directory) : new StringLiteralWriter(directory);
    const objectWriter = new ObjectEntityWriter(directory, this.params, this.config);
    const unionWriter = new UnionEntityWriter(directory);

    progress.increment(1);

    for (const { type } of items) {
      if (type instanceof Enum) {
        enumWriter.write(type);
      } else if (type instanceof ObjectEntity) {
        objectWriter.write(type);
      } else if (type instanceof InheritedEntity) {
        this.handleInheritedEntity(objectWriter, type);
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

  private handleInheritedEntity(writer: ObjectEntityWriter, source: InheritedEntity) {
    const objects = source.baseEntities.filter(x => x.type instanceof ObjectEntity).map(x => x.type as ObjectEntity);

    const properties = objects.slice(1).flatMap(x => x.properties);
    const composedEntity = new ObjectEntity(source.name, properties);
    writer.write(composedEntity, objects[0]);
  }
}
