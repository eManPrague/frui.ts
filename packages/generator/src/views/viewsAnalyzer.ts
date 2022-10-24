import type { Project, SourceFile } from "ts-morph";

export default class ViewsAnalyzer {
  analyze(project: Project, viewFilesPattern: string) {
    const viewFiles = [] as SourceFile[];

    project.getSourceFiles(viewFilesPattern).forEach(file => {
      const isViewRegistration = file
        .getImportDeclarations()
        .some(i => i.getNamedImports().some(n => n.getName() === "registerView" || n.getName() === "registerViewComponent"));

      if (isViewRegistration) {
        viewFiles.push(file);
      }
    });

    return viewFiles;
  }
}
