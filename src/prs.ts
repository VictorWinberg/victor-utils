import _ from "lodash/fp";

import * as api from "./api";
import { LIBS, SERVICES } from "./constants";
import { bump, dump, formatDate, load, log, maybeIndex } from "./utils";

export async function prs() {
  const input = await load<typeof output>("pull-requests.json");

  const REPOS = [...SERVICES, ...LIBS];

  const pullRequests = _.sortBy(
    "-created_on",
    _.flatten(await Promise.all(REPOS.map(api.getPullRequests)))
  );

  const activityLog = _.groupBy(
    "pull_request.id",
    _.flatten(await Promise.all(REPOS.map(api.getPullRequestsActivity)))
  );

  const output = pullRequests.map((pr) => ({
    id: pr.id,
    title: pr.title,
    author: pr.author.display_name,
    repo: pr.destination.repository.name,
    date: formatDate(pr.created_on),
    link: pr.links.html.href,
    state: pr.state,
    comments: pr.comment_count,
    tasks: pr.task_count,
    activity: activityLog[pr.id]
      ?.map(({ comment, approval, update }) => ({
        comment: comment?.content.raw,
        approval: approval ? true : undefined,
        status: update?.changes.status?.new,
        reviewers: update?.reviewers?.map(_.get("display_name")),
        user:
          comment?.user.display_name ||
          approval?.user.display_name ||
          update?.author.display_name,
        date: formatDate(comment?.created_on || approval?.date || update?.date),
      }))
      .map(_.pickBy(_.identity)),
    created: pr.created_on,
  }));

  const updated = output
    .filter(
      (pr) =>
        !(
          JSON.stringify(pr) ===
          JSON.stringify(input.find((i) => i.id === pr.id))
        )
    )
    .map((pr) => {
      const prev = input.find((i) => i.id === pr.id);
      if (!prev) return pr;

      return _.pickBy(_.identity, {
        id: pr.id,
        title: pr.title,
        author: pr.author,
        repo: pr.repo,
        date: pr.date,
        link: pr.link,
        new_comments: pr.comments - prev.comments || undefined,
        new_tasks: pr.tasks - prev.tasks || undefined,
        new_activity: pr.activity?.slice(
          0,
          maybeIndex(_.findIndex(prev.activity?.[0], pr.activity))
        ),
      });
    });

  if (updated.length > 0) {
    updated.forEach((pr) => log(pr));
    bump();
  }

  await dump(output, "pull-requests.json");
}

await prs();
