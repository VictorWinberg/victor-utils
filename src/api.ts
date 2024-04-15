import fetch, { RequestInit } from "node-fetch";
import { PullRequest, PullRequestActivity, PullRequests, Tags } from "./types";
import config from "./config";

const { baseUrl, workspace, headers } = config.bitbucket;

async function bitbucket<T>(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(baseUrl + url, { headers, ...options });
    const json = await res.json();
    return json as T;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTags(repo: string) {
  const params = new URLSearchParams({ sort: "-target.date" });
  const url = `/repositories/${workspace}/${repo}/refs/tags?${params}`;
  const res = await bitbucket<Tags>(url);
  return res.values;
}

export async function getMyPullRequests() {
  const user = process.env.BITBUCKET_AUTHOR;
  const url = `/pullrequests/${user}`;
  const res = await bitbucket<PullRequests>(url);
  return res.values;
}

export async function getPullRequests(repo: string) {
  const url = `/repositories/${workspace}/${repo}/pullrequests`;
  const res = await bitbucket<PullRequests>(url);
  return res.values;
}

export async function getPullRequestsActivity(repo: string) {
  const url = `/repositories/${workspace}/${repo}/pullrequests/activity`;
  const res = await bitbucket<PullRequestActivity>(url);
  return res.values;
}

export async function getPullRequest(repo: string, id: number) {
  const url = `/repositories/${workspace}/${repo}/pullrequests/${id}`;
  const res = await bitbucket<PullRequest>(url);
  return res;
}

export async function getLatestTag(repo: string) {
  const tags = await getTags(repo);
  return tags.filter((tag) => tag.name.match(/^v\d+\.\d+\.\d+$/))[0]?.name;
}
