import { uniqBy } from "lodash";
import type { Project } from "ts-morph";
import { ClassDeclaration } from "ts-morph";
import type ServiceRegistration from "./models/serviceRegistration";
import type ServiceRule from "./models/serviceRule";

export default class ExportsAnalyzer {
  analyze(project: Project, rules: ServiceRule[]) {
    const registrations = [] as ServiceRegistration[];

    project.getSourceFiles().forEach(file => {
      file.getExportedDeclarations().forEach((declarations, _key) => {
        const declaration = declarations[0];
        if (declaration instanceof ClassDeclaration && !declaration.isAbstract()) {
          const className = declaration.getName();

          if (className) {
            const matchingRule = rules.find(x => x.regexPattern.test(className));

            if (matchingRule) {
              registrations.push({
                declaration,
                rule: matchingRule,
              });
            }
          }
        }
      });
    });

    return uniqBy(registrations, x => x.declaration);
  }
}
