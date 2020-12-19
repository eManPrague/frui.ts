import path from "path";
import { Directory, IndentationText, Project, SourceFile, ts } from "ts-morph";
import { fileGeneratedHeader } from "./messages.json";

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

    const defaultConfig = await this.getDefaultConfig();

    if (this.params.config) {
      const configPath = path.join(process.cwd(), this.params.config);
      const customConfig = await import(configPath);
      this.config = Object.assign({}, defaultConfig, customConfig);
    } else {
      this.config = defaultConfig;
    }
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
      ?.getStatementByKind(ts.SyntaxKind.SingleLineCommentTrivia || ts.SyntaxKind.MultiLineCommentTrivia)
      ?.getText()
      .includes("generator:ignore");
  }

  protected writeGeneratedHeader(file: SourceFile) {
    file.insertText(0, x => x.writeLine(fileGeneratedHeader));
  }

  protected abstract getDefaultConfig(): Promise<TConfig>;
}
