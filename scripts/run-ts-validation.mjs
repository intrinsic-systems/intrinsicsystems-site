import { build } from "esbuild";

const entryPoint = process.argv[2];
if (!entryPoint) {
  throw new Error("A TypeScript validation entry point is required.");
}

const result = await build({
  entryPoints: [entryPoint],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  target: "node20",
  logLevel: "silent",
});

const source = result.outputFiles[0]?.text;
if (!source) throw new Error("Validation bundle was not produced.");

await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
