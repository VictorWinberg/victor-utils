import _ from "lodash/fp";

import * as api from "./api";
import config from "./config";
import { LIBS, SERVICES } from "./constants";
import {
  bump,
  dump,
  formatDate,
  json,
  log,
  maybeEmpty,
  maybeIndex,
} from "./utils";

const uniqueId = (pr) => `${pr.destination.repository.name}#${pr.id}`;

export async function prs() {
  const input = await json<typeof output>("pull-requests.json");

  const REPOS = [...SERVICES, ...LIBS];

  const pullRequests = _.sortBy(
    "-created_on",
    _.flatten(await Promise.all(REPOS.map(api.getPullRequests)))
  );

  const activityLog = _.groupBy(
    "key",
    _.flatten(
      (await Promise.all(REPOS.map(api.getPullRequestsActivity))).map(
        (prs, idx) =>
          prs.map((pr) => ({
            key: `${REPOS[idx]}#${pr.pull_request.id}`,
            ...pr,
          }))
      )
    )
  );

  const output = pullRequests
    .map((pr) => ({
      id: uniqueId(pr),
      title: pr.title,
      author: pr.author.display_name,
      date: formatDate(pr.created_on),
      link: pr.links.html.href,
      state: pr.state,
      comments: pr.comment_count,
      tasks: pr.task_count,
      activity: activityLog[uniqueId(pr)]
        ?.map(({ comment, approval, update, changes_requested }) => ({
          comment: comment?.content.raw,
          approval: approval ? true : undefined,
          changes_requested: changes_requested ? true : undefined,
          status: update?.changes.status?.new,
          reviewers: update?.reviewers?.map(_.get("display_name")),
          user:
            comment?.user.display_name ||
            approval?.user.display_name ||
            update?.author.display_name ||
            changes_requested?.user.display_name,
          date: formatDate(
            comment?.created_on ||
              approval?.date ||
              update?.date ||
              changes_requested?.date
          ),
        }))
        .map(_.pickBy(_.identity)),
      created: pr.created_on,
    }))
    .filter((pr) => JSON.stringify(pr).includes(config.bitbucket.author));

  const updated = output
    .map((pr) => {
      const prev = input?.find((i) => i.id === pr.id);
      if (!prev) return pr;

      return _.pickBy(_.identity, {
        id: pr.id,
        title: pr.title,
        author: pr.author,
        date: pr.date,
        link: pr.link,
        new_comments: pr.comments - prev.comments || undefined,
        new_tasks: pr.tasks - prev.tasks || undefined,
        new_activity: maybeEmpty(
          pr.activity?.slice(
            0,
            maybeIndex(_.findIndex(prev.activity?.[0], pr.activity))
          )
        ),
      });
    })
    .filter((pr) =>
      _.some(
        (key) => _.keys(pr).includes(key),
        ["new_comments", "new_tasks", "new_activity"]
      )
    );

  if (updated.length > 0) {
    updated.forEach((pr) => log(pr));
    bump();
  }

  await dump(output, "pull-requests.json");
}

await prs();
