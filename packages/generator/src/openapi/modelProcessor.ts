import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPI } from "openapi-types";
import { createProgressBar } from "../progressBar";
import ApiModel from "./models/apiModel";
import { isOpenAPIv2, isOpenAPIv3 } from "./parsers/helpers";
import OpenApi2Parser from "./parsers/openApi2Parser";
import OpenApi3Parser from "./parsers/openApi3Parser";

export default class ModelProcessor {
  async process(apiPath: string) {
    const progress = createProgressBar("Analysing");
    progress.start(2, 0);

    const api = await SwaggerParser.parse(apiPath);
    progress.increment();

    const model = this.parseModel(api);
    progress.increment();
    progress.stop();

    return model;
  }

  private parseModel(api: OpenAPI.Document): ApiModel {
    if (isOpenAPIv2(api)) {
      const parser = new OpenApi2Parser();
      parser.parse(api);
      return new ApiModel(parser.entities, parser.enums);
    }

    if (isOpenAPIv3(api)) {
      const parser = new OpenApi3Parser();
      parser.parse(api);
      return new ApiModel(parser.entities, parser.enums);
    }

    console.error("Unknown api format", api);
    throw new Error("Unknown api format");
  }
}
