import peg from "pegjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function loadParser<T>(url: string, name: string) {
  const filename = fileURLToPath(url);
  const dirname = path.dirname(filename).replace("dist", "src");
  const grammar = fs
    .readFileSync(path.resolve(dirname, name))
    .toString("utf8");

  const pegParser = peg.generate(grammar);
  return (input: string): T => pegParser.parse(input);
}
