import { SourceFile } from "ts-morph";
import GeneratorBase from "../generatorBase";
import GeneratorParams from "./generatorParams";

export default class ViewsGenerator extends GeneratorBase<GeneratorParams, any> {
  private viewsFile: SourceFile;

  async run() {
    if (this.ensureViewsFile()) {
      this.forEachFile(file => {
        const isViewRegistration = file
          .getImportDeclarations()
          .some(i => i.getNamedImports().some(n => n.getName() === "registerView"));

        if (isViewRegistration) {
          const path = this.viewsFile.getRelativePathAsModuleSpecifierTo(file);

          this.viewsFile.addImportDeclaration({
            moduleSpecifier: path,
          });
        }
      }, "**/views/**/*.tsx");
    }

    await this.saveFile(this.viewsFile);
  }

  private ensureViewsFile() {
    if (!this.viewsFile && this.params.output) {
      this.viewsFile = this.project.createSourceFile(this.params.output, undefined, { overwrite: true });
    }
    return this.viewsFile;
  }

  protected getDefaultConfig() {
    return Promise.resolve({});
  }
}
