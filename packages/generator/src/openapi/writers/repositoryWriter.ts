/* eslint-disable @typescript-eslint/tslint/config */
import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { getRelativePath, pascalCase } from "../../helpers";
import Endpoint from "../models/endpoint";
import TypeReference from "../models/typeReference";
import { IConfig } from "../types";
import { getPath } from "../utils";

export default class RepositoryWriter {
  constructor(
    private parentDirectory: Directory,
    private config: IConfig,
    private templates: Record<"repositoryAction" | "repositoryFile", Handlebars.TemplateDelegate>
  ) {}

  write(repositoryBaseName: string, actions: Endpoint[]) {
    const repositoryName = `${pascalCase(repositoryBaseName)}Repository`;

    const fileName = `${camelCase(repositoryName)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const existingFile = this.parentDirectory.getSourceFile(fileName);
    return existingFile
      ? this.updateFile(existingFile, repositoryName, actions)
      : this.createFile(fileName, repositoryName, actions);
  }

  private updateFile(file: SourceFile, repositoryName: string, actions: Endpoint[]) {
    const repository = file.getClassOrThrow(pascalCase(repositoryName));

    for (const action of actions) {
      const method = repository.getMethod(camelCase(action.name));

      if (!method) {
        repository.addMember(this.getActionContent(action));
      }
    }

    return file;
  }

  private createFile(fileName: string, repositoryName: string, actions: Endpoint[]) {
    const result = this.templates.repositoryFile({
      repositoryName,
      imports: this.getRequiredImports(actions),
      actions: () => actions.map(x => this.getActionContent(x)),
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  private getRequiredImports(actions: Endpoint[]) {
    return uniq(
      actions
        .flatMap(action => [action.queryParam, action.requestBody?.typeReference, getMainResponse(action)?.typeReference])
        .filter((x): x is TypeReference => !!x && x.isImportRequired)
    ).map(entity => {
      const name = entity.getTypeName() ?? "";
      const entitiesPath = this.config.entitiesPath;
      let entityPath: string;

      if (typeof entitiesPath === "object") {
        entityPath = getPath(entitiesPath, name, this.config.defaultEntitiesPath);
      } else {
        entityPath = entitiesPath;
      }

      return `import ${name} from "${getRelativePath(this.config.repositoriesPath, entityPath)}/${camelCase(name)}";`;
    });
  }

  private getActionContent(action: Endpoint) {
    const mainResponse = getMainResponse(action);

    const context = {
      action,
      path: getPathStringWithPlaceholders(action),
      parameters: this.getMethodParameters(action),
      requestContentType: action.requestBody?.contentType,
      response: mainResponse,
      isResponseArray: mainResponse?.typeReference.isArray,
      responseType: mainResponse?.typeReference.getTypeName(),
      responseTypeDeclaration: mainResponse?.typeReference.getTypeDeclaration(),
      responses:
        action.responses &&
        Object.entries(action.responses).map(([statusCode, resultType]) => ({
          statusCode,
          returnType: resultType?.typeReference.getTypeDeclaration(),
        })),
    };

    return this.templates.repositoryAction(context);
  }

  private *getMethodParameters(action: Endpoint) {
    for (const parameter of action.pathParams) {
      yield `${parameter.name}: ${parameter.type.getTypeDeclaration()}`;
    }

    if (action.queryParam) {
      yield `query: ${action.queryParam.getTypeDeclaration()}`;
    }

    if (action.requestBody) {
      yield `payload: ${action.requestBody.typeReference.getTypeDeclaration()}`;
    }
  }
}

// function isPagedListAction(action: Endpoint) {
//   const response = getMainResponse(action);

//   if (action.method !== "get" || !response || response.typeReference.isArray) {
//     return false;
//   }

//   // TODO
//   return false;
// }

function getMainResponse(action: Endpoint) {
  if (!action.responses) {
    return undefined;
  }

  const key = Object.keys(action.responses)
    .filter(x => x >= "200")
    .sort()[0];
  return action.responses[key];
}

function getPathStringWithPlaceholders(action: Endpoint) {
  let path = action.path;
  for (const param of action.pathParams) {
    path = path.replace(`{${param.externalName || param.name}}`, "${" + param.name + "}");
  }

  return path;
}
