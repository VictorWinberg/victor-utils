import { $ } from "execa";
import _ from "lodash/fp";
import config from "./config";
import { SERVICES } from "./constants";
import { bump, cmd, dir, dump, json, log, yaml } from "./utils";

const {
  bitbucket: { workspace },
  deployStuff: { repo, valuesFolder },
} = config;

export async function getDEPs() {
  await cmd(dir)`git clone git@bitbucket.org:${workspace}/${repo}.git`;

  const head = `${repo}/${valuesFolder}`;
  const values = await yaml(`${head}/values.yaml`);
  await $({ cwd: `${dir}/${repo}` })`git checkout smart-deploy`;
  const valuesRelease = await yaml(`${head}/values-release.yaml`);

  function getTag(values, service: string): string {
    const image = values.image[service.replace(/-/g, "_")];
    const ui = values.ui[service];
    return (image || ui)?.tag;
  }

  const stageTags = SERVICES.map((service) => getTag(values, service));
  const stage = _.zipObject(SERVICES, stageTags);

  const prodTags = SERVICES.map((service) => getTag(valuesRelease, service));
  const prod = _.zipObject(SERVICES, prodTags);

  await cmd(dir)`rm -rf ${repo}`;

  return { stage, prod };
}

export async function newDEPs() {
  const input = await json<typeof output>("deps.json");
  const output = await getDEPs();
  await dump(output, "deps.json");
  if (!input) return;

  const transform = _.flow(
    _.toPairs,
    _.map(([key, v]) => _.mapKeys((service) => `${key}: ${service}`, v)),
    _.mergeAll,
    _.toPairs
  );
  const flatInput: any[] = transform(input);
  const flatOutput: any[] = transform(output);
  const diff = _.fromPairs(_.differenceWith(_.isEqual, flatOutput, flatInput));
  if (_.isEmpty(diff)) return;

  log(diff);
  bump();
}

log(await getDEPs());
newDEPs();
