import * as glob from "glob";
import _ from "lodash/fp";
import { $ } from "execa";
import config from "./config";
import { __dirname, getLang, log, readXML } from "./utils";
import { XLIFF_STATES } from "./constants";

const { workspace = "" } = config.bitbucket;
const dir = `${__dirname}/../dump`;

const cmd = (dir?: string) => {
  return $({ stdout: ["inherit", "pipe"], cwd: dir });
};

const args = process.argv.slice(2);
const [repo, command, ...extra] = args;
if (!repo || !command) {
  console.log("Usage: git <repo> <command>");
  process.exit(1);
}

switch (command) {
  case "tag": {
    if (extra.length === 0) {
      console.log("Usage: git <repo> tag <patch|minor|major>");
      process.exit(1);
    }
    await cmd(dir)`rm -rf ${repo}`;
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
    type Translation = {
      id: string;
      value: string;
      state: string;
      source: string;
    };
    const missingTranslations: Record<string, Translation[]> = {};

    if (!glob.sync(`${dir}/${babelfish}`).length) {
      await cmd(dir)`git clone git@bitbucket.org:${workspace}/${babelfish}.git`;
    } else {
      await cmd(`${dir}/${babelfish}`)`git reset --hard @{u}`;
      await cmd(`${dir}/${babelfish}`)`git pull`;
    }

    const sourceXML = await readXML(`${baseDir}/${source}`);
    let sourceUnits = sourceXML.xliff.file[0].body[0]["trans-unit"];

    let targetFiles = glob.sync(`${baseDir}/${targets}`).reverse();
    targetFiles = targetFiles.filter((f) => !f.includes(source));

    let targetStates: string[] = [];
    let outputPick = ["id", "value", "state", "source"];

    if (extra.length > 0) {
      const units = sourceUnits.filter((unit) => extra.includes(unit.$.id));
      const files = targetFiles.filter((file) => extra.includes(getLang(file)));
      targetStates = XLIFF_STATES.filter((s) => extra.includes(s));
      const pick = outputPick.filter((s) => extra.includes(s));

      const count = [...units, ...files, ...targetStates, ...pick].length;
      if (count !== extra.length) {
        log({ count, extra });
        console.log(`Error: Invalid arguments "${extra.join(", ")}"`);
        process.exit(1);
      }

      if (files.length > 0) {
        targetFiles = files;
      }
      if (units.length > 0) {
        sourceUnits = units;
      }
      if (pick.length > 0) {
        outputPick = pick;
      }
    }

    for (const targetFile of targetFiles) {
      const lang = getLang(targetFile);

      const targetXML = await readXML(targetFile);
      const targetUnits = targetXML.xliff.file[0].body[0]["trans-unit"];

      for (const sourceUnit of sourceUnits) {
        const sourceId = sourceUnit.$.id;
        const sourceValue = sourceUnit.source[0];

        const targetUnit = targetUnits.find((unit) => unit.$.id === sourceId);
        const unitValue = targetUnit?.target?.[0]?._;
        const unitState = targetUnit?.target?.[0]?.$?.state;

        const hasTargetState = targetStates.some((state) =>
          state.startsWith("-")
            ? unitState !== state.slice(1)
            : unitState === state.slice(1)
        );

        if (targetStates.length > 0 ? hasTargetState : !unitValue) {
          (missingTranslations[lang] ||= []).push({
            id: sourceId,
            value: unitValue,
            state: unitState,
            source: sourceValue,
          });
        }
      }
    }

    log(_.mapValues(_.map(_.pick(outputPick)), missingTranslations));
  }
}
