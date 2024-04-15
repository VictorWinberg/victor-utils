import * as glob from "glob";
import config from "./config";
import { __dirname, log, readXML } from "./utils";
import { $ } from "execa";

const { workspace = "" } = config.bitbucket;
const dir = `${__dirname}/../dump`;

const cmd = (dir?: string) => {
  return $({ stdout: ["inherit", "pipe"], cwd: dir });
};

const args = process.argv.slice(2);
const [repo, command, ...extra] = args;
if (!repo || !command) {
  log("Usage: git <repo> <command>");
  process.exit(1);
}

switch (command) {
  case "tag": {
    if (extra.length === 0) {
      log("Usage: git <repo> tag <patch|minor|major>");
      process.exit(1);
    }
    await cmd(dir)`git clone git@bitbucket.org:${workspace}/${repo}.git`;

    if (repo === "august-model") {
      // Custom versioning
      await cmd(`${dir}/${repo}`)`npm version ${extra[0]} --no-git-tag-version`;

      const v = "require('./package.json').version";
      const { stdout: version } = await cmd(`${dir}/${repo}`)`node -p ${v}`;

      const msg = `[skip ci] ${version}`;
      await cmd(`${dir}/${repo}`)`git commit -am ${msg}`;

      const tag = `source tag: ${version}-src`;
      await cmd(`${dir}/${repo}`)`git tag -am ${tag} v${version}-src`;
    } else {
      await cmd(`${dir}/${repo}`)`npm version ${extra[0]}`;
    }

    await cmd(`${dir}/${repo}`)`git push --follow-tags`;
    await cmd(dir)`rm -rf ${repo}`;
    break;
  }
  case "babelfish": {
    const babelfish = "august-babelfish";
    const baseDir = `${dir}/${babelfish}/translations/${repo}`;
    const source = "translations.source.xlf";
    const targets = "translations.*.xlf";
    const missingTranslations = {};
    let mode: "default" | "target-state" | "filter-id" = "default";

    await cmd(dir)`git clone git@bitbucket.org:${workspace}/${babelfish}.git`;

    const sourceXML = await readXML(`${baseDir}/${source}`);
    let sourceUnits = sourceXML.xliff.file[0].body[0]["trans-unit"];

    if (extra[0]) {
      const sourceUnit = sourceUnits.find((unit) => unit.$.id === extra[0]);
      if (sourceUnit) {
        mode = "filter-id";
        sourceUnits = [sourceUnit];
      } else {
        mode = "target-state";
      }
    }

    const targetFiles = glob.sync(`${baseDir}/${targets}`).reverse();
    for (const targetFile of targetFiles) {
      const lang = targetFile.match(/translations\.(.+)\.xlf$/)?.[1] || "";
      if (lang === "source") continue;

      const targetXML = await readXML(targetFile);
      const targetUnits = targetXML.xliff.file[0].body[0]["trans-unit"];

      for (const sourceUnit of sourceUnits) {
        const sourceId = sourceUnit.$.id;

        const targetUnit = targetUnits.find((unit) => unit.$.id === sourceId);
        const targetValue = targetUnit?.target?.[0]?._;
        const targetState = targetUnit?.target?.[0]?.$?.state;

        switch (mode) {
          case "default": {
            if (!targetValue) {
              (missingTranslations[lang] ||= []).push(sourceId);
            }
            break;
          }
          case "filter-id": {
            (missingTranslations[lang] ||= []).push({
              value: targetValue,
              state: targetState,
            });
            break;
          }
          case "target-state": {
            if (
              extra[0].startsWith("-")
                ? targetState !== extra[0].slice(1)
                : targetState === extra[0]
            ) {
              (missingTranslations[lang] ||= []).push({
                [sourceId]: targetState,
              });
            }
            break;
          }
        }
      }
    }

    log(missingTranslations);
    await cmd(dir)`rm -rf ${babelfish}`;
  }
}
