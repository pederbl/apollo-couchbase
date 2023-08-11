import glob from 'glob';
import path from 'path';

type ResolverType = 'Query' | 'Mutation';

type Resolvers = {
  [key in ResolverType]: {
    [key: string]: Function;
  };
};

type ResolverMetadata = {
  resolverType: ResolverType;
  resolverName: string;
  resolverFilepath: string;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function generateResolvers(): Promise<Resolvers> {
  const resourcesPath = `${process.cwd()}/src/graphql/resources`;
  const resolverFilepaths = glob.sync(`${resourcesPath}/**/{query,mutation}/*.ts`);

  const resolverMetadataList: ResolverMetadata[] = resolverFilepaths.map((resolverFilepath) => {
    const [resourceName, resolverTypeRaw, operationNameRaw] = resolverFilepath.split('/').slice(-3);
    const resolverType = capitalize(resolverTypeRaw) as ResolverType;
    const operationName = capitalize(operationNameRaw.replace('.ts', ''));
    const resolverName = resourceName + operationName;

    if (!(resolverType === 'Query' || resolverType === 'Mutation')) {
      throw new Error(`Invalid resolver type: ${resolverType}`);
    }

    return { resolverType, resolverName, resolverFilepath };
  });
  
  const importedResolverFunctionsTasks = resolverMetadataList.map(async ({ resolverType, resolverName, resolverFilepath }) => {
      const resolverModule = await import(resolverFilepath);
      const resolver = resolverModule.resolver;

      if (typeof resolver !== 'function') {
        throw new Error(
          `Expected a function for resolver, but got ${typeof resolver}. ResourceName: ${resolverName}, OperationName: ${resolverType}`,
        );
      }

      return { resolverType, resolverName, resolver };
    })

  const importedResolverFunctions = await Promise.all(importedResolverFunctionsTasks); 

  const graphQlResolversObject = importedResolverFunctions.reduce((accumulator, { resolverType, resolverName, resolver }) => {
    accumulator[resolverType][resolverName] = resolver;
    return accumulator;
  }, { Query: {}, Mutation: {} } as Resolvers);

  return graphQlResolversObject;
}
