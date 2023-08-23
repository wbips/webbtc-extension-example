import { globSync } from "glob";

const pageFiles = globSync("pages/*.html");

const arrayKeyValuePairs = pageFiles.map((file) => [
  file.split("\\").slice(-1).toString().split(".html").join(""),
  file,
]);

export const pages = Object.fromEntries(arrayKeyValuePairs);
