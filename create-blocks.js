// ✅ Make sure you have

// ✅ schemaBlockTypes.ts

// ✅ importSchemaType.ts

// ✅ importPageBuiderTypes.ts

// please run npm run predev to generate types

const fs = require("fs");
const path = require("path");

const blockName = process.argv[2];

const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(blockName);

if (!isPascalCase) {
  console.error(
    "❌ Invalid block name. Please use PascalCase (e.g., TestBlock, HeroSection). Do not start with an uppercase letter, use hyphens (-), or spaces."
  );
  process.exit(1);
}

if (!blockName) {
  console.error(
    "❌ Please provide a block name: node scripts/createBlock.js block-name"
  );
  process.exit(1);
}

const pascalCase = (str) =>
  str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

const BlockComponentName = pascalCase(blockName) + "Block";

const frontEndPath = path.join(
  __dirname,
  "./frontend/app/components/blocks",
  blockName,
  "index.tsx"
);

const sanityPath = path.join(
  __dirname,
  "./studio/src/schemaTypes/objects",
  blockName,
  "index.ts"
);

const frontendContent = `import { ${pascalCase(blockName)} } from "@/sanity.types";

type ${pascalCase(blockName)}Props = { 
  block: ${pascalCase(blockName)};
  index: number;
}

export default function ${BlockComponentName}({ block }: ${pascalCase(blockName)}Props) {
  return (
    <div className="block_${blockName}">
        <h2>${pascalCase(blockName)}</h2>
    </div>
  );
}`;

const schemaContent = `import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const ${blockName} = defineType({
  name: "${blockName}",
  title: "${blockName} Section",
  type: "object",
  icon: DocumentIcon,
  preview: {
    select: {
      title: "heading",
      cmsTitle: "cmsTitle",
    },
    prepare({ heading, cmsTitle }: any) {
      return {
        title: cmsTitle ||  heading || "${pascalCase(blockName)}",
      };
    }, 
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
  ],
});
`;

function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }

  if (fs.existsSync(filePath)) {
    console.warn(`⚠️ File already exists: ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ Created file: ${filePath}`);
}

createFile(frontEndPath, frontendContent);
createFile(sanityPath, schemaContent);

const rawBlockName = blockName; // giữ nguyên tên nhập
const importName = pascalCase(rawBlockName) + "Block";
const importPath = `@/app/components/blocks/${rawBlockName}`;
const schemaBlockTypesPath = path.join(
  __dirname,
  "./frontend/app/schemaBlockTypes.ts"
);

function updateSchemaBlockTypes() {
  if (!fs.existsSync(schemaBlockTypesPath)) {
    console.warn("⚠️ schemaBlockTypes.ts not found. Skipping update.");
    return;
  }

  let content = fs.readFileSync(schemaBlockTypesPath, "utf-8");

  const importLine = `import ${importName} from "${importPath}";`;

  if (!content.includes(importLine)) {
    const lines = content.split("\n");

    const lastImportIndex = lines.reduce((lastIndex, line, idx) => {
      if (line.startsWith("import ")) {
        return idx;
      }
      return lastIndex;
    }, -1);

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importLine);
    } else {
      lines.unshift(importLine);
    }

    content = lines.join("\n");
  }

  const entryLine = `  ${rawBlockName}: ${importName},`;

  if (!content.includes(entryLine)) {
    content = content.replace(
      /export const blockRenderers\s*=\s*{([\s\S]*?)}/,
      (match, inner) => {
        return `export const blockRenderers = {\n${inner.trimEnd()}\n${entryLine}\n}`;
      }
    );
  }

  fs.writeFileSync(schemaBlockTypesPath, content);
  console.log("✅ Updated schemaBlockTypes.ts with name ${importName}.");
}

updateSchemaBlockTypes();

function updateImportSchemaTypes(blockName) {
  const schemaImportPath = path.join(
    __dirname,
    "./studio/src/schemaTypes/importSchemaType.ts"
  );

  if (!fs.existsSync(schemaImportPath)) {
    console.warn("⚠️ importSchemaType.ts not found. Skipping update.");
    return;
  }

  let content = fs.readFileSync(schemaImportPath, "utf-8");

  const importName = blockName;
  const importLine = `import { ${importName} } from "./objects/${blockName}";`;

  if (!content.includes(importLine)) {
    const lines = content.split("\n");
    const lastImportIndex = lines.reduce((lastIdx, line, idx) => {
      if (line.startsWith("import ")) return idx;
      return lastIdx;
    }, -1);

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importLine);
    } else {
      lines.unshift(importLine);
    }

    content = lines.join("\n");
  }

  const arrayRegex = /export const importSchemaTypes\s*=\s*\[((?:.|\n)*?)\]/m;
  const match = content.match(arrayRegex);

  if (match) {
    const arrayBody = match[1];

    const elements = arrayBody
      .split(",")
      .map((line) => line.replace(/\/\/.*$/, "").trim())
      .filter((line) => line.length > 0);

    const alreadyExists = elements.includes(importName);

    if (!alreadyExists) {
      elements.push(importName);

      const newArray = `export const importSchemaTypes = [\n  ${elements.join(",\n  ")}\n]`;
      content = content.replace(arrayRegex, newArray);
    }
  }

  fs.writeFileSync(schemaImportPath, content);
  console.log("✅ updated importSchemaType.ts");
}

updateImportSchemaTypes(blockName);

function updateImportPageBuilderTypes(blockName) {
  const pageBuilderPath = path.join(
    __dirname,
    "./studio/src/schemaTypes/objects/importPageBuilderTypes.ts"
  );

  if (!fs.existsSync(pageBuilderPath)) {
    console.warn("importPageBuilderTypes.ts not found. Skipping update.");
    return;
  }

  let content = fs.readFileSync(pageBuilderPath, "utf-8");

  const arrayRegex =
    /export const importPageBuilderTypes\s*=\s*\[((?:.|\n)*?)\]/m;
  const match = content.match(arrayRegex);

  if (match) {
    const arrayBody = match[1];

    const lines = arrayBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"));

    const exists = lines.some(
      (line) =>
        line.includes(`type: '${blockName}'`) ||
        line.includes(`type: "${blockName}"`)
    );

    if (exists) {
      console.log("✅ Block already exists in importPageBuilderTypes.ts");
      return;
    }

    // Remove trailing commas and rebuild array with safe commas
    const cleanLines = lines.map((line) => line.replace(/,?$/, ""));
    cleanLines.push(`{ type: '${blockName}' }`);

    const finalArray =
      "export const importPageBuilderTypes = [\n  " +
      cleanLines.join(",\n  ") +
      "\n];";

    content = content.replace(arrayRegex, finalArray);
    fs.writeFileSync(pageBuilderPath, content);
    console.log("✅ Updated importPageBuilderTypes.ts");
  } else {
    console.warn("⚠️ Not found: export const importPageBuilderTypes = [ ... ]");
  }
}

updateImportPageBuilderTypes(blockName);