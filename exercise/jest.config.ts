import { pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
import { join } from "path";

// tsconfig.json を読み込む
const tsconfig = JSON.parse(readFileSync(join(__dirname, "tsconfig.json"), "utf8"));

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" })
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
};

