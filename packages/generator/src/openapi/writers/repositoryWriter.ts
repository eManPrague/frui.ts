/* eslint-disable @typescript-eslint/tslint/config */
import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import { ClassDeclaration, CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { pascalCase } from "../../helpers";
import { entityGeneratedHeader } from "../../messages.json";
import Endpoint from "../models/endpoint";
import TypeReference from "../models/typeReference";

export interface RepositoryWriterConfig {
  entitiesRelativePath: string;
}

export default class RepositoryWriter {
  constructor(private parentDirectory: Directory, private config: RepositoryWriterConfig) {}

  write(repositoryBaseName: string, actions: Endpoint[]) {
    const repositoryName = `${pascalCase(repositoryBaseName)}Repository`;

    const fileName = `${camelCase(repositoryName)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const existingFile = this.parentDirectory.getSourceFile(fileName);
    const actualFile = existingFile
      ? this.updateFile(existingFile, repositoryName, actions)
      : this.createFile(fileName, repositoryName, actions);

    actualFile.formatText();
    return actualFile;
  }

  private updateFile(file: SourceFile, repositoryName: string, actions: Endpoint[]) {
    const currentClass = file.getClassOrThrow(pascalCase(repositoryName));
    this.updateClass(currentClass, actions);

    return file;
  }

  private createFile(fileName: string, repositoryName: string, actions: Endpoint[]) {
    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        writer.writeLine(entityGeneratedHeader);
        writer.writeLine(`import RepositoryBase from "./repositoryBase";`);
        this.writeEntityImports(writer, actions);

        writer.blankLineIfLastNot();
        writer.writeLine(`export default class ${repositoryName} extends RepositoryBase {`);

        for (const action of actions) {
          this.writeAction(writer, action);
        }

        writer.writeLine("}");
      },
      { overwrite: true }
    );
  }

  private updateClass(repository: ClassDeclaration, actions: Endpoint[]) {
    for (const action of actions) {
      const method = repository.getMethod(camelCase(action.name));

      if (!method) {
        repository.addMember(writer => {
          this.writeAction(writer, action);
        });
      }
    }
  }

  private writeEntityImports(writer: CodeBlockWriter, actions: Endpoint[]) {
    const entitiesToImport = uniq(
      actions
        .flatMap(action => [action.queryParam, action.requestBody?.typeReference, getMainResponse(action)?.typeReference])
        .filter((x): x is TypeReference => !!x && x.isImportRequired)
    );

    entitiesToImport.forEach(entity => {
      const name = entity.getTypeName();
      writer.writeLine(`import ${name} from "${this.config.entitiesRelativePath}/${camelCase(name)}";`);
    });
  }

  private writeAction(writer: CodeBlockWriter, action: Endpoint) {
    writer.conditionalWriteLine(!!action.description, `/** ${action.description} */`);
    writer.write(camelCase(action.name));
    writer.write("(");

    const parameters = Array.from(this.getMethodParameters(action));
    writer.write(parameters.join(", "));

    writer.write(")");
    writer.block(() => this.writeMethodBody(writer, action));
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

  private writeMethodBody(writer: CodeBlockWriter, action: Endpoint) {
    const response = getMainResponse(action);

    switch (action.method) {
      case "get":
        // const isPaged = isPagedListAction(action);

        this.writeApiCall(writer, action, () => {
          if (response) {
            const queryParameterText = action.queryParam ? ", query" : "";
            if (response.typeReference.isArray) {
              writer.write(`.getEntities(${response.typeReference.getTypeName()}${queryParameterText})`);
            } else {
              writer.write(`.getEntity(${response.typeReference.getTypeName()}${queryParameterText})`);
            }
          }
        });
        break;

      case "post":
      case "put":
      case "patch":
        const isPayloadFormsData = action.requestBody?.contentType === "multipart/form-data";
        if (isPayloadFormsData) {
          writer.writeLine(`entityToFormData(payload);`);
        }

        this.writeApiCall(writer, action, () => {
          if (action.requestBody) {
            writer.write(`.${action.method}${isPayloadFormsData ? "Data" : "Entity"}(payload`);
            writer.conditionalWrite(!!response, `, ${response?.typeReference.getTypeDeclaration()}`);
            writer.write(`)`);
          } else {
            writer.write(`.${action.method}({})`);
          }
        });
        break;

      default:
        writer.writeLine(`// ${action.method} ${action.path}`);
        break;
    }

    if (action.responses) {
      for (const [result, resultType] of Object.entries(action.responses)) {
        writer.writeLine(`// ${result}: ${resultType?.typeReference.getTypeDeclaration()}`);
      }
    }
  }

  private writeApiCall(writer: CodeBlockWriter, action: Endpoint, additionalContent: () => void) {
    const path = getPathStringWithPlaceholders(action);
    writer.write(`return this.callApi(api => api.path(${path})`);
    additionalContent();
    writer.write(`);`);
    writer.newLine();
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

  return "`" + path + "`";
}
