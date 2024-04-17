import _ from "lodash/fp";
import * as api from "./api";
import { LIBS, SERVICES } from "./constants";
import { bump, dump, json, log } from "./utils";

export async function tags() {
  const serviceTags = await Promise.all(SERVICES.map(api.getLatestTag));
  const services = _.zipObject(SERVICES, serviceTags);

  const libTags = await Promise.all(LIBS.map(api.getLatestTag));
  const libs = _.zipObject(LIBS, libTags);

  return { services, libs };
}

export async function newTags() {
  const input = await json<typeof output>("tags.json");
  const output = await tags();
  await dump(output, "tags.json");

  const flatInput = _.toPairs(_.mergeAll(_.flatMap(_.identity, input)));
  const flatOutput = _.toPairs(_.mergeAll(_.flatMap(_.identity, output)));
  const diff = _.fromPairs(_.differenceWith(_.isEqual, flatOutput, flatInput));
  if (_.isEmpty(diff)) return;

  log(diff);
  bump();
}

log(await tags());
newTags();
