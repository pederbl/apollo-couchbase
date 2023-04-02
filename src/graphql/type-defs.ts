import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export async function generateTypeDefs(customTypeDefs?: string): Promise<string> {
  const resourceNames = readdirSync(join("src", "graphql", "resources"));
  const resourceTypeDefs = resourceNames
    .map((resourceName) =>
      readFileSync(join("src", "graphql", "resources", resourceName, "schema.graphql"), {
        encoding: "utf-8",
      })
    )
    .join("\n");

  const apolloCouchTypeDefs = readFileSync(join("node_modules", "apollo-couch", "src", "graphql", "schema.graphql"), {
     encoding: "utf-8",
  });
  const typeDefs = `${resourceTypeDefs}\n${apolloCouchTypeDefs}${customTypeDefs ? `\n${customTypeDefs}` : ""}`;

  return typeDefs;
}


