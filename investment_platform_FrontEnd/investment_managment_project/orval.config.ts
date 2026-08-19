import { defineConfig } from "orval";
import { config } from "dotenv";

config();

const apiSpecUrl = process.env.API_SPEC_URL;

if (!apiSpecUrl) {
  throw new Error(
    "API_SPEC_URL is not defined in .env. " +
      "Set it to your OpenAPI spec URL or local path.",
  );
}

export default defineConfig({
  api: {
    input: { target: apiSpecUrl },
    output: {
      target: "./lib/api/generated",
      client: "react-query",
      mode: "tags-split",
      mock: false,
      schemas: {
        path: "./lib/api/generated/schemas",
        type: "typescript",
        splitByTags: true,
      },
      tagsSplitDeduplication: true,
      override: {
        mutator: {
          path: "./lib/api/orval/axios-instance.ts",
          name: "customMutator",
        },
        query: {
          useQuery: true,
          useSuspenseQuery: false,
          useInfinite: false,
          useInfiniteQueryParam: "page",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "pnpm exec prettier --write --ignore-unknown",
    },
  },
  zod: {
    input: { target: apiSpecUrl },
    output: {
      target: "./lib/api/generated/zod",
      client: "zod",
      mode: "tags-split",
      mock: false,
      schemaFileExtension: ".validation.ts",
      schemas: {
        path: "./lib/api/generated/zod",
        type: "zod",
        splitByTags: true,
      },
      override: {
        zod: {
          generateReusableSchemas: true,
          strict: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: true,
          },
          generate: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: true,
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "pnpm exec prettier --write --ignore-unknown",
    },
  },
});
