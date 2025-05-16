// Simple script to run ts-node on Windows without ESM module resolution issues
process.env.NODE_ENV = "development";

// Import the compiled version
require("ts-node/register");
require("./server/index.ts");
