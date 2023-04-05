import glob from 'glob';
import path from 'path';

type ResolverType = 'Query' | 'Mutation';

type Resolvers = {
  [key in ResolverType]: {
    [key: string]: Function;
  };
};

function isResolverType(value: string): value is ResolverType {
  return value === 'Query' || value === 'Mutation';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function generateResolvers(): Promise<Resolvers> {
  const _resolvers: Resolvers = {
    Query: {},
    Mutation: {}
  };

  const resourcesPath = path.join(process.cwd(), 'src/graphql/resources');
  const resolverFilepaths = glob.sync(`${resourcesPath}/**/{query,mutation}/*.ts`);

  const tasks = resolverFilepaths.map(async (resolverFilepath) => {
      const resolverModule = await import(resolverFilepath);
      const resolver = resolverModule.resolver;
  
      const [resourceName, resolverTypeRaw, operationNameRaw] = resolverFilepath.split('/').slice(-3);
      const resolverType = capitalize(resolverTypeRaw);
      const operationName = capitalize(operationNameRaw.replace(".ts", ""));
      const resolverName = resourceName + operationName;
  
      if (!isResolverType(resolverType)) {
        throw new Error(`Invalid resolver type: ${resolverType}`);
      }
  
      if (typeof resolver !== 'function') {
        throw new Error(`Expected a function for resolver, but got ${typeof resolver}. ResourceName: ${resourceName}, OperationName: ${operationName}`);
      }
  
      _resolvers[resolverType][resolverName] = resolver;
     }
  );
  await Promise.all(tasks);

  return _resolvers;
}

