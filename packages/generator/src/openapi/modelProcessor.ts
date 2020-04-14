import SwaggerParser from "@apidevtools/swagger-parser";
import { uniqBy } from "lodash";
import { OpenAPI } from "openapi-types";
import { createProgressBar } from "../progressBar";
import Constants from "./constants";
import Entity from "./models/entity";
import Enum from "./models/enum";
import { isOpenAPIv2, isOpenAPIv3 } from "./parsers/helpers";
import OpenApi2Parser from "./parsers/openApi2Parser";
import OpenApi3Parser from "./parsers/openApi3Parser";

export default class ModelProcessor {
  async process(apiPath: string) {
    const progress = createProgressBar("Analysing");
    progress.start(3, 0);

    const api = await SwaggerParser.parse(apiPath);
    progress.increment();

    const entities = this.parseEntities(api);
    progress.increment();

    const enums = this.extractEnums(entities);
    progress.increment();
    progress.stop();

    return { entities, enums };
  }

  private parseEntities(api: OpenAPI.Document) {
    if (isOpenAPIv2(api)) {
      return new OpenApi2Parser().parse(api);
    } else if (isOpenAPIv3(api)) {
      return new OpenApi3Parser().parse(api);
    } else {
      console.error("Unknown api format", api);
      throw new Error("Unknown api format");
    }
  }

  private extractEnums(entities: Entity[]) {
    const properties = entities.flatMap(e => Array.from(e.properties.values()).filter(p => p.type?.isEnum && p.type?.definition));
    return uniqBy(properties, p => p.type.definition).map(p => {
      const definition = p.type.definition as string;
      return {
        name: p.type.name,
        definition: definition,
        items: definition.split(Constants.enumSeparator),
      } as Enum;
    });
  }
}
