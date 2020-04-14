import { Project } from "ts-morph";
import { createProgressBar } from "../progressBar";
import Entity from "./models/entity";
import Enum from "./models/enum";
import EntityWriter from "./writers/entityWriter";
import EnumWriter from "./writers/enumWriter";

export default class FileGenerator {
  constructor(private project: Project, private entities: Entity[], private enums: Enum[]) {}

  async generate(outputFolder: string) {
    const progress = createProgressBar("Generating");
    progress.start(this.entities.length + this.enums.length + 2, 0);

    const directory = this.project.createDirectory(outputFolder);

    const enumWriter = new EnumWriter(directory);
    for (const definition of this.enums) {
      enumWriter.write(definition);
      progress.increment();
    }
    await this.project.save();
    progress.increment();

    const entityWriter = new EntityWriter(directory);
    for (const definition of this.entities) {
      entityWriter.write(definition);
      progress.increment();
    }
    await this.project.save();
    progress.increment();

    progress.stop();
  }
}
