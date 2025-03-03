import esbuild from "esbuild";
import minimist from "minimist";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const args = minimist(process.argv.slice(2));

const target = args._[0] || "reactivity";
const format = args.f || "iife";
console.log(format);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const globalName = target.replace(/-(\w)/g, (_, c) =>
  c ? c.toUpperCase() : ""
);
//打包
esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    format,
    sourcemap: true,
    platform: "browser",
    globalName: globalName,
  })
  .then((ctx) => {
    console.log(`构建成功`);
    return ctx.watch();
  });
