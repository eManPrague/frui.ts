import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPI } from "openapi-types";
import { createProgressBar } from "../progressBar";
import type ApiModel from "./models/apiModel";
import { isOpenAPIv2, isOpenAPIv3 } from "./parsers/helpers";
import OpenApi2Parser from "./parsers/openApi2Parser";
import OpenApi3Parser from "./parsers/openApi3Parser";
import type { IApiParserConfig } from "./types";

export default class ModelProcessor {
  async process(apiPath: string, parserConfig?: IApiParserConfig) {
    const progress = createProgressBar("Analysing");
    progress.start(2, 0);

    const api = parserConfig?.bundleReferences ? await SwaggerParser.bundle(apiPath) : await SwaggerParser.parse(apiPath);

    progress.increment();

    const model = this.parseModel(api, parserConfig);
    progress.increment();
    progress.stop();

    return model;
  }

  private parseModel(api: OpenAPI.Document, config?: IApiParserConfig): ApiModel {
    if (isOpenAPIv2(api)) {
      const parser = new OpenApi2Parser(api);
      parser.parse();
      return parser;
    }

    if (isOpenAPIv3(api)) {
      const parser = new OpenApi3Parser(api, config);
      parser.parse();
      return parser;
    }

    console.error("Unknown api format", api);
    throw new Error("Unknown api format");
  }
}
