import { SingleBar } from "cli-progress";
import { ExportedDeclarations, Project, SourceFile } from "ts-morph";

export interface BaseParams {
  project: string;
  config: string;
}

type MapForEachCallback<K, V> = (value: V, key: K, map: ReadonlyMap<K, V>) => void;

export default abstract class GeneratorBase<TParams extends BaseParams, TConfig> {
  protected project: Project;
  protected config: Partial<TConfig>;

  constructor(protected params: TParams) {}

  public async init() {
    this.project = new Project({
      tsConfigFilePath: this.params.project,
    });

    if (this.params.config) {
      this.config = await import(this.params.config);
    } else {
      this.config = await this.getDefaultConfig();
    }
  }

  protected forEachFile(action: (file: SourceFile) => void, fileGlobPattern?: string) {
    const progressBar = GeneratorBase.createProgress("Processing");

    const files = fileGlobPattern ? this.project.getSourceFiles(fileGlobPattern) : this.project.getSourceFiles();
    progressBar.start(files.length, 0);

    for (let index = 0; index < files.length; index++) {
      progressBar.update(index);

      const file = files[index];
      action(file);
    }

    progressBar.update(files.length);
    progressBar.stop();
  }

  protected forEachExport(action: MapForEachCallback<string, ExportedDeclarations[]>, thisArg?: any, fileGlobPattern?: string) {
    this.forEachFile(file => {
      const exports = file.getExportedDeclarations();
      exports.forEach(action, thisArg);
    }, fileGlobPattern);
  }

  protected saveFile(file: SourceFile) {
    const progress = GeneratorBase.createProgress(file.getBaseName());
    progress.start(4, 0);

    this.writeGeneratedHeader(file);
    progress.increment();

    file.organizeImports();
    progress.increment();

    file.formatText();
    progress.increment();

    file.saveSync();
    progress.increment();
    progress.stop();
  }

  protected writeGeneratedHeader(file: SourceFile) {
    file.insertText(0, x => {
      x.writeLine("// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.");
    });
  }

  protected abstract getDefaultConfig(): Promise<TConfig>;

  protected static createProgress(name: string) {
    return new SingleBar(GeneratorBase.getProgressOptions(name));
  }
  protected static getProgressOptions(name: string) {
    return {
      format: `${name.padEnd(18)} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
    };
  }
}
