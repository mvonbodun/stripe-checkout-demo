#!/usr/bin/env node

// Generate JSON descriptors from .proto files so runtime doesn't need filesystem access
const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');

async function buildDescriptor(entryProto, outJson) {
  try {
    const root = await protobuf.load(entryProto);
    const json = root.toJSON();
    const outDir = path.dirname(outJson);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outJson, JSON.stringify(json, null, 2));
    console.log(`Generated descriptor: ${outJson}`);
  } catch (err) {
    console.error(`Failed generating descriptor for ${entryProto}:`, err);
    throw err;
  }
}

(async () => {
  const tasks = [
    {
      entry: path.join(process.cwd(), 'proto', 'catalog', 'catalog.proto'),
      out: path.join(process.cwd(), 'app', 'lib', 'proto-descriptors', 'catalog.json'),
    },
    {
      entry: path.join(process.cwd(), 'proto', 'inventory', 'inventory.proto'),
      out: path.join(process.cwd(), 'app', 'lib', 'proto-descriptors', 'inventory.json'),
    },
    {
      entry: path.join(process.cwd(), 'proto', 'price', 'offer.proto'),
      out: path.join(process.cwd(), 'app', 'lib', 'proto-descriptors', 'price.json'),
    },
  ];

  for (const t of tasks) {
    await buildDescriptor(t.entry, t.out);
  }
})().catch((e) => {
  console.error('Descriptor generation failed.');
  process.exit(1);
});
