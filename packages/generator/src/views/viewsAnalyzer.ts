import { Project, SourceFile } from "ts-morph";

export default class ViewsAnalyzer {
  analyze(project: Project) {
    const viewFiles = [] as SourceFile[];

    project.getSourceFiles("**/views/**/*.tsx").forEach(file => {
      const isViewRegistration = file
        .getImportDeclarations()
        .some(i => i.getNamedImports().some(n => n.getName() === "registerView"));

      if (isViewRegistration) {
        viewFiles.push(file);
      }
    });

    return viewFiles;
  }
}
