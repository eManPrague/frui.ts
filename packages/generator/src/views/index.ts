import type { SourceFile } from "ts-morph";
import GeneratorBase from "../generatorBase";
import { createProgressBar } from "../progressBar";
import type GeneratorParams from "./generatorParams";
import ViewsAnalyzer from "./viewsAnalyzer";
import ViewsProcessor from "./viewsProcessor";

export default class ViewsGenerator extends GeneratorBase<GeneratorParams, any> {
  private viewsFile: SourceFile;

  async run() {
    const progressBar = createProgressBar("Generating");
    progressBar.start(5, 0);

    const viewFiles = new ViewsAnalyzer().analyze(this.project);
    progressBar.increment();

    const processor = new ViewsProcessor(this.ensureViewsFile());
    const code = processor.process(viewFiles);
    progressBar.increment();

    this.viewsFile.addImportDeclarations(code.importStatements);
    progressBar.increment();

    this.viewsFile.addStatements(code.statements);
    progressBar.increment();

    await this.saveFile(this.viewsFile);
    progressBar.increment();
    progressBar.stop();
  }

  private ensureViewsFile() {
    // TODO refactor this
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.viewsFile && this.params.output) {
      this.viewsFile = this.project.createSourceFile(this.params.output, undefined, { overwrite: true });
    }
    return this.viewsFile;
  }

  protected getDefaultConfig() {
    return Promise.resolve({});
  }
}
