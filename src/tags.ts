import _ from "lodash/fp";

import * as api from "./api";
import { LIBS, SERVICES } from "./constants";
import { dump, load, log } from "./utils";

export async function tags() {
  const serviceTags = await Promise.all(SERVICES.map(api.getLatestTag));
  const services = _.zipObject(SERVICES, serviceTags);

  const libTags = await Promise.all(LIBS.map(api.getLatestTag));
  const libs = _.zipObject(LIBS, libTags);

  return { services, libs };
}

export async function newTags() {
  const input = await load<typeof output>("tags.json");
  const output = await tags();
  await dump(output, "tags.json");

  const flatInput = _.mergeAll(_.flatMap(_.identity, input));
  const flatOutput = _.mergeAll(_.flatMap(_.identity, output));
  const diff = _.omitBy((v, k) => flatInput[k] === v, flatOutput);
  if (_.isEmpty(diff)) return;

  log(diff);
}

log(await tags());
newTags();
