import { Project } from "ts-morph";
import { createProgressBar } from "../progressBar";
import Entity from "./models/entity";
import Enum from "./models/enum";
import ObjectEntity from "./models/objectEntity";
import { IGeneratorParams } from "./types";
import EnumWriter from "./writers/enumWriter";
import ObjectEntityWriter from "./writers/objectEntityWriter";
import TypeEntityWriter from "./writers/typeEntityWriter";

export default class FileGenerator {
  constructor(private project: Project, private entities: Entity[], private enums: Enum[]) {}

  async generate(params: IGeneratorParams) {
    const progress = createProgressBar("Generating");
    progress.start(this.entities.length + this.enums.length + 2, 0);

    const directory = this.project.createDirectory(params.outputFolder);

    const enumWriter = new EnumWriter(directory);
    for (const definition of this.enums) {
      enumWriter.write(definition);
      progress.increment();
    }
    await this.project.save();
    progress.increment();

    const objectEntityWriter = new ObjectEntityWriter(directory, params);
    const typeEntityWriter = new TypeEntityWriter(directory);
    for (const definition of this.entities) {
      if (definition instanceof ObjectEntity) {
        objectEntityWriter.write(definition);
      } else {
        typeEntityWriter.write(definition);
      }

      progress.increment();
    }
    await this.project.save();
    progress.increment();

    progress.stop();
  }
}
