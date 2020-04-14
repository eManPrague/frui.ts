import { ExportedDeclarations, Project, SourceFile, IndentationText, Directory, ts } from "ts-morph";
import { createProgressBar } from "./progressBar";

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
    // TODO make formatting configurable or load from settings
    this.project = new Project({
      tsConfigFilePath: this.params.project,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
      },
    });

    if (this.params.config) {
      this.config = await import(this.params.config);
    } else {
      this.config = await this.getDefaultConfig();
    }
  }

  protected forEachFile(action: (file: SourceFile) => void, fileGlobPattern?: string) {
    const progress = createProgressBar("Processing");
    progress.start(1, 0);

    const files = fileGlobPattern ? this.project.getSourceFiles(fileGlobPattern) : this.project.getSourceFiles();
    progress.setTotal(files.length + 1);
    progress.increment();

    for (let index = 0; index < files.length; index++) {
      action(files[index]);
      progress.increment();
    }

    progress.stop();
  }

  protected forEachExport(action: MapForEachCallback<string, ExportedDeclarations[]>, thisArg?: any, fileGlobPattern?: string) {
    this.forEachFile(file => {
      const exports = file.getExportedDeclarations();
      exports.forEach(action, thisArg);
    }, fileGlobPattern);
  }

  protected async saveFile(file: SourceFile) {
    this.writeGeneratedHeader(file);
    file.organizeImports();
    file.formatText();
    await file.save();
  }

  public static generatedFileHeader =
    "// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.";

  public static canOverwiteFile(parent: Project | Directory, path: string) {
    const file = parent.getSourceFile(path);

    return !file
      ?.getStatementByKind(ts.SyntaxKind.SingleLineCommentTrivia || ts.SyntaxKind.MultiLineCommentTrivia)
      ?.getText()
      .includes("generator:ignore");
  }

  protected writeGeneratedHeader(file: SourceFile) {
    file.insertText(0, x => x.writeLine(GeneratorBase.generatedFileHeader));
  }

  protected abstract getDefaultConfig(): Promise<TConfig>;
}
