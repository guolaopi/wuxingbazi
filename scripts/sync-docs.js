import {
    copyFile,
    mkdir,
    readFile,
    readdir,
    rm,
    writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distDirectory = path.join(projectRoot, "dist");
const docsDirectory = path.join(projectRoot, "docs");
const distIndexPath = path.join(distDirectory, "index.html");
const docsIndexPath = path.join(docsDirectory, "index.html");
const distAssetPrefix = "/assets/";
const docsAssetPrefix = "/wuxingbazi/assets/";

async function copyDirectory(sourceDirectory, targetDirectory) {
    await mkdir(targetDirectory, { recursive: true });

    const entries = await readdir(sourceDirectory, { withFileTypes: true });
    await Promise.all(
        entries.map(async (entry) => {
            const sourcePath = path.join(sourceDirectory, entry.name);
            const targetPath = path.join(targetDirectory, entry.name);

            if (entry.isDirectory()) {
                await copyDirectory(sourcePath, targetPath);
                return;
            }

            if (entry.isFile()) {
                await copyFile(sourcePath, targetPath);
                return;
            }

            throw new Error(`dist 中存在不支持的文件类型：${sourcePath}`);
        })
    );
}

const distIndexHtml = await readFile(distIndexPath, "utf8");
const assetReferenceCount = (
    distIndexHtml.match(/\/assets\//g) || []
).length;

if (assetReferenceCount === 0) {
    throw new Error(
        `未在 ${distIndexPath} 中找到 ${distAssetPrefix} 资源引用，docs 未更新。`
    );
}

await rm(docsDirectory, { recursive: true, force: true });
await copyDirectory(distDirectory, docsDirectory);

const docsIndexHtml = `${distIndexHtml
    .replace(/\/assets\//g, docsAssetPrefix)
    .replace(/[ \t]+$/gm, "")
    .trimEnd()}\n`;
await writeFile(docsIndexPath, docsIndexHtml, "utf8");

console.log(
    `已将 dist 同步到 docs，并更新 ${assetReferenceCount} 处资源路径为 ${docsAssetPrefix}`
);
