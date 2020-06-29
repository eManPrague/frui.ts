import uniqBy from "lodash/uniqBy";
import { ClassDeclaration, Project } from "ts-morph";
import ServiceRegistration from "./models/serviceRegistration";
import ServiceRule from "./models/serviceRule";

export default class ExportsAnalyzer {
  analyze(project: Project, rules: ServiceRule[]) {
    const registrations = [] as ServiceRegistration[];

    project.getSourceFiles().forEach(file => {
      file.getExportedDeclarations().forEach((declarations, key) => {
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
