import { promises as fsPromises } from "fs";
import { join } from "path";

async function readTypeDefs(filePaths: string[]): Promise<string[]> {
  const tasks = filePaths.map(async (filePath) => {
    const content = await fsPromises.readFile(filePath, {
      encoding: "utf-8",
    });
    return content;
  });

  return Promise.all(tasks);
}

export async function generateTypeDefs(customTypeDefs?: string): Promise<string> {
  const [resourceNames, apolloCouchResourceNames] = await Promise.all([
    fsPromises.readdir(join("src", "graphql", "resources")),
    fsPromises.readdir(join("node_modules", "apollo-couchbase", "src", "graphql", "resources")),
  ]);

  const resourceTypeDefPaths = resourceNames.map((resourceName) =>
    join("src", "graphql", "resources", resourceName, "schema.graphql")
  );

  const apolloCouchResourceTypeDefPaths = apolloCouchResourceNames.map((resourceName) =>
    join("node_modules", "apollo-couchbase", "src", "graphql", "resources", resourceName, "schema.graphql")
  );

  const apolloCouchSharedTypeDefPath = join("node_modules", "apollo-couchbase", "src", "graphql", "schema.graphql");

  const allTypeDefPaths = [
    ...resourceTypeDefPaths,
    ...apolloCouchResourceTypeDefPaths,
    apolloCouchSharedTypeDefPath,
  ];

  const typeDefContents = await readTypeDefs(allTypeDefPaths);

  const typeDefs = typeDefContents.join("\n");

  return typeDefs;
}
