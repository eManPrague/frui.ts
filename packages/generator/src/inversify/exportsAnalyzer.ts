import { uniqBy } from "lodash";
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
                scope: matchingRule.scope,
                addDecorators: !!matchingRule.addDecorators,
              });
            }
          }
        }
      });
    });

    return uniqBy(registrations, x => x.declaration);
  }
}
