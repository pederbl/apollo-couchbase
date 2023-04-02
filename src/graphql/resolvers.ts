import { readdirSync } from "fs";
import { join } from "path";
import { Resolvers } from "./generated-types";

type ResolverType = "mutations" | "queries";

function getResourcePath(resourceName: string, resolverType?: ResolverType, resolverName?: string): string {
  const pathParts = ["src", "graphql", "resources", resourceName];

  if (resolverType) {
    pathParts.push(resolverType);
  }

  if (resolverName) {
    pathParts.push(resolverName);
  }

  return join(process.cwd(), ...pathParts);
}

function getResourceNames() {
  return readdirSync(join(process.cwd(), "src", "graphql", "resources"));
}

async function importResolver(resolverType: ResolverType, resourceName: string, resolverName: string) {
  const moduleImportPath = getResourcePath(resourceName, resolverType, resolverName);
  const _module = await import(moduleImportPath);
  const resolver = _module.default;
  if (typeof resolver !== "function") {
    throw new Error(`The default export is not a function: ${moduleImportPath}`);
  }
  return resolver;
}

function getResolverNames(resourceName: string, resolverType: ResolverType): string[] {
  const resolverDirPath = getResourcePath(resourceName, resolverType);
  return readdirSync(resolverDirPath).map(filename => filename.replace(/\.ts$/, ''));
}

async function getResolvers(resolverType: ResolverType, customResolvers?: Resolvers): Promise<Record<string, Function>> {
  const resolvers: Record<string, Function> = {};

  const resourceNames = getResourceNames();
  const tasks = resourceNames.map(async (resourceName) => {
    const resolverNames = getResolverNames(resourceName, resolverType);
    const resolverTasks = resolverNames.map(async (resolverName) => {
      const resolver = await importResolver(resolverType, resourceName, resolverName);
      const resolverFullName = `${resourceName}${resolverName}`;
      resolvers[resolverFullName] = resolver;
    });
    await Promise.all(resolverTasks);
  });
  await Promise.all(tasks);

  if (customResolvers) {
    Object.assign(resolvers, customResolvers);
  }

  return resolvers;
}

export async function generateResolvers(customResolvers?: Resolvers): Promise<Resolvers> {
  const [mutationResolvers, queryResolvers] = await Promise.all([
    getResolvers("mutations", customResolvers?.Mutation),
    getResolvers("queries", customResolvers?.Query),
  ]);

  const resolvers: Resolvers = {
    Mutation: mutationResolvers,
    Query: queryResolvers,
  };

  return resolvers;
}


