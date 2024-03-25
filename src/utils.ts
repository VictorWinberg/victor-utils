import dayjs from "dayjs";
import _ from "lodash/fp";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function bump() {
  process.stdout.write("\u0007");
}

export function clearTerminal() {
  process.stdout.write("\x1Bc");
}

export function maybeIndex(index: number) {
  return index === -1 ? undefined : index;
}

export function maybeEmpty<T>(object: T) {
  return _.isEmpty(object) ? undefined : object;
}

export function formatDate(date?: string) {
  if (!date) return undefined;
  return dayjs(date).format("ddd DD MMM HH:mm");
}

export async function dump(json: any, filename: string) {
  await fs.writeFile(
    `${__dirname}/../dump/${filename}`,
    JSON.stringify(json, null, 2)
  );
}

export async function load<T>(filename: string) {
  return JSON.parse(
    await fs.readFile(`${__dirname}/../dump/${filename}`, "utf8")
  ) as T;
}

export function log(object: any) {
  console.log(inspect(object, false, null, true));
}
