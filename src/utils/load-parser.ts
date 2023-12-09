import peg from "pegjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Loads a grammar file from a specified location and compiles a parser from it.
 * 
 * @param url pass `import.meta.url`
 * @param name relative location of the parser file, for example `./parser.pegjs`
 * @returns PEG.js parse function
 */
export function loadParser<T>(url: string, name: string): (input: string) => T {
  const filename = fileURLToPath(url);
  const dirname = path.dirname(filename).replace("dist", "src");
  const grammar = fs.readFileSync(path.resolve(dirname, name)).toString("utf8");

  return peg.generate(grammar).parse;
}
