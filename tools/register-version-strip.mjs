// Registers the version-strip resolve hook for the test run (see
// version-strip-hooks.mjs). Loaded via `node --import` in the test script.
import { register } from "node:module";

register("./version-strip-hooks.mjs", import.meta.url);
