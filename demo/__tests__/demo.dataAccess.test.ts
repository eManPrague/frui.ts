import { FetchApiConnector } from "@frui.ts/apiclient";
import fetch from "fetch-with-proxy";
import { IssuesRepository } from "../src/dataAccess/issuesRepository";
import { RedmineRequestBuilder } from "../src/dataAccess/redmineRequestBuilder";

const apiFactory = () => {
  const apiConnector = new FetchApiConnector(fetch as any);
  const params: RequestInit = {
    headers: { "X-Redmine-API-Key": "x" },
  };
  return new RedmineRequestBuilder(apiConnector, "https://redmine.dev.eman.cz", params);
};

describe.skip("IssuesRepository", () => {
  test("getAllIssues", async () => {
    const repository = new IssuesRepository(apiFactory);

    const [issues, page] = await repository.getAllIssues(null, { offset: 1, limit: 2 });

    expect(issues).toBeDefined();
    expect(page.offset).toBe(1);
    expect(page.limit).toBe(2);
  });

  test("getIssueDetail", async () => {
    const repository = new IssuesRepository(apiFactory);

    const issue = await repository.getIssueDetail(76473);

    expect(issue).toBeDefined();
    expect(issue.id).toBe(76473);
    expect(issue.subject.length).toBeGreaterThan(1);
  });
});
