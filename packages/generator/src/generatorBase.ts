import path from "path";
import type { Directory, SourceFile } from "ts-morph";
import { IndentationText, Project, ts } from "ts-morph";
import { fileGeneratedHeader } from "./messages.json";
import { createProgressBar } from "./progressBar";

export interface BaseParams {
  project: string;
  config: string;
  debug: boolean;
}

export default abstract class GeneratorBase<TParams extends BaseParams, TConfig> {
  protected project: Project;
  protected config: TConfig;

  constructor(protected params: TParams) {}

  public async init() {
    const progress = createProgressBar("Parsing");
    progress.start(2, 0);

    // TODO make formatting configurable or load from settings
    this.project = new Project({
      tsConfigFilePath: this.params.project,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
      },
    });

    progress.increment();

    if (this.params.debug) {
      this.logDiagnostics();
    }

    const defaultConfig = await this.getDefaultConfig();

    if (this.params.config) {
      const configPath = path.join(process.cwd(), this.params.config);
      const customConfig: unknown = await import(configPath);
      this.config = Object.assign({}, defaultConfig, customConfig);
    } else {
      this.config = defaultConfig;
    }

    progress.increment();
    progress.stop();
  }

  protected async saveFile(file: SourceFile) {
    this.writeGeneratedHeader(file);
    file.organizeImports();
    file.formatText();
    await file.save();
  }

  public static canOverwiteFile(parent: Project | Directory, path: string) {
    const file = parent.getSourceFile(path);

    return !file
      ?.getStatementByKind(ts.SyntaxKind.SingleLineCommentTrivia | ts.SyntaxKind.MultiLineCommentTrivia)
      ?.getText()
      .includes("generator:ignore");
  }

  protected writeGeneratedHeader(file: SourceFile) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    file.insertText(0, x => x.writeLine(fileGeneratedHeader));
  }

  protected getDiagnostics() {
    const entries = this.project.getPreEmitDiagnostics();
    return entries.map(x => ({
      message: x.getMessageText(),
      source: x.getSource(),
      lineNumber: x.getLineNumber(),
      code: x.getCode(),
      category: x.getCategory,
    }));
  }

  protected logDiagnostics() {
    for (const row of this.getDiagnostics()) {
      console.warn(row);
    }
  }

  protected abstract getDefaultConfig(): Promise<TConfig>;
}
