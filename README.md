# Apollo On The Couch

A framework for building GraphQL APIs with the Apollo GraphQL server backed by Couchbase. The main purpose of this 
framework is to make it simple to build super scalable and reliable APIs quickly and cost-effectively. 

## Getting Started

### Prerequisites 
* A Couchbase Capella account or your own Couchbase server. 
* Node.js
* npm or similar

### Create Your `Apollo On The Couch` Server Project

#### Create a Typescript project with the appropriate dependencies.
```bash
mkdir my-apollo-couch-server
cd my-apollo-couch-server
npm init -y
tsc --init
npm install apollo-couch couchbase graphql
npm install --save-dev @types/node @graphql-codegen/cli @graphql-codegen/typescript-resolvers eslint nodemon typescript
```

#### Create the required files
```bash
mkdir src
touch src/index.ts codegen.ts .env
```

#### Open your editor and update the src/index.ts file
```typescript
import { startApolloCouchServer } from "apollo-couch";

startApolloCouchServer();
```

#### Update the tsconfig.json file
```json
{
  "compilerOptions": {
      "preserveConstEnums": true,
      "strictNullChecks": true,
      "sourceMap": true,
      "allowJs": true,
      "target": "es5",
      "module": "es6",
      "outDir": ".build",
      "moduleResolution": "node",
      "lib": ["es2015"],
      "rootDir": "./",
      "baseUrl": ".",
      "paths": {
          "*": ["*", "src/*"]
      },
      "allowSyntheticDefaultImports": true,
      "skipLibCheck": true
  },
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  },
  "include": ["src/**/*", "scripts/generate-schema.ts", "apollo-couch/src/data", "apollo-couch/src/graphql/lib", "apollo-couch/src/couchbase"]
}
```


#### Update the codegen.ts file
```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "src/graphql/**/*.graphql", 
    "node_modules/apollo-couch/src/graphql/**/*.graphql"
  ],
  generates: {
    "src/graphql/generated-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true
      },
    }, 
  }
};

export default config;
```

#### Update the package.json file
```json
{  
  ...
  "type": "module",
  "scripts": {
    "init": "npm run generate-graphql-types",
    "dev": "nodemon -r dotenv/config src/index.ts",
    "generate-graphql-types": "graphql-codegen --config codegen.ts",
    "generate-resource": "generate-resource",
    "postgenerate-resource": "npm run generate-graphql-types"
  },
}
````

#### Configure the Couchbase Environment Variables in the .env file

Remember to add the `.env` file to your `.gitignore` file to avoid accidentally committing sensitive information.

##### Capella database
```bash
PORT=4000
LOCAL=true

COUCHBASE_USER=username
COUCHBASE_PASSWORD=password
COUCHBASE_ENDPOINT=couchbases://cb.yourendpoint.cloud.couchbase.com
COUCHBASE_DEFAULT_BUCKET=_default
COUCHBASE_DEFAULT_SCOPE=_default
COUCHBASE_IS_CLOUD_INSTANCE=true
```

##### Localhost database
```bash
PORT=4000
LOCAL=true

COUCHBASE_USER=username
COUCHBASE_PASSWORD=password
COUCHBASE_ENDPOINT=couchbase://localhost
COUCHBASE_DEFAULT_BUCKET=_default
COUCHBASE_DEFAULT_SCOPE=_default
COUCHBASE_IS_CLOUD_INSTANCE=false
```


### Generate an ```apollo-couch``` resource 
In `apollo-couch`, the GraphQL schema and resolvers are structured in what's called `resources`. These resources will typically be very similar to REST resources, with CrUD operations.  

You can use a scaffolding script, `generate-resource`, to generate a new resource. This script will generate resources with scaffold resolvers and schema files that you can edit to fit your purposes.  

You also have the flexibility to create your own resources that can contain any type of API resolvers and schema. 

To create a resource using the scaffolding script, follow these steps:

#### Run the generate-resource script:
```bash
npm run generate-resource <resourceNameInPlural>
```

#### Edit the ./src/graphql/resources/`<resourceNameInPlural>`/schema.graphql file. Fill in the properties you want to expose on the resource.
E.g.
```graphql
type AccountContent {
    name: String!
    phone: String
}

input AccountContentInput {
  name: String!
  phone: String
}

input AccountContentPatchInput {
  name: String
  phone: String
}

input AccountsListFiltersInput {
  name: String
}
```
Notice that there is no exclamation mark in the `AccountContentPatchInput` input, since you probably don't want to require any field to be included when patching records. 

#### Run the generate-graphql-types script:
```bash
npm run generate-graphql-types
```

### Start the server
```bash
npm run dev
```

## License
This project is licensed under the ISC License. See the LICENSE file for details.