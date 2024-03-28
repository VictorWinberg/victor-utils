import { log } from "console";
import config from "./config";
import { __dirname } from "./utils";
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
  case "tag":
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
