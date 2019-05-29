import { IRedminePageInfo } from "./redminePageInfo";

// tslint:disable-next-line: interface-name
export interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string;
}

// tslint:disable-next-line: interface-name
export interface ProjectsQuery extends IRedminePageInfo {
  projects: Project[];
}
