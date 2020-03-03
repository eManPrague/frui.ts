import { IRedminePageInfo } from "./redminePageInfo";

export interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string;
}

export interface ProjectsQuery extends IRedminePageInfo {
  projects: Project[];
}
