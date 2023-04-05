# Apollo On The Couch 

A framework for building an Apollo GraphQL API backed by Couchbase.

## Getting Started

### Prerequisites 
* A Couchbase Capella account or your own Couchbase server. 
* Node.js
* npm or similar

### Create Your ```apollo-couch``` Server Project

#### Create a Typescript project with the appropriate dependencies.
```bash
mkdir my-apollo-couch-server
cd my-apollo-couch-server
npm init -y
tsc --init
npm install apollo-couch couchbase graphql
npm install --save-dev @types/node @graphql-codegen/cli @graphql-codegen/typescript-resolvers eslint nodemon
```

#### Create the required files
```bash
mkdir src
touch src/index.ts codegen.ts .env
```

#### Open your editor and update the src/index.ts file
```typescript
import { startApolloCouchServer } from "apollo-couch";

startApolloCouchServer(4000);
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
  ...
  "scripts": {
    ...
    "dev": "nodemon -r dotenv/config src/index.ts",
    "generate-graphql-types": "graphql-codegen --config codegen.ts",
    "generate-resource": "generate-resource"
  }
}
````

#### Configure the Couchbase Environment Variables in the .env file

COUCHBASE_USER: The username for the Couchbase server.  
COUCHBASE_PASSWORD: The password for the Couchbase server.  
COUCHBASE_ENDPOINT: (Optional) The Couchbase server endpoint. If not provided, it defaults to localhost.  
COUCHBASE_BUCKET: The Couchbase bucket you want to use.  
COUCHBASE_SCOPE: (Optional) The Couchbase scope you want to use in the selected bucket. If not provided, it defaults to _default.  
IS_CLOUD_INSTANCE: (Optional) Set this to 'true' if you are connecting to a cloud instance of Couchbase. If not provided, it defaults to 'false'.  

```bash
COUCHBASE_USER=username
COUCHBASE_PASSWORD=password
COUCHBASE_ENDPOINT=cb.yourendpoint.cloud.couchbase.com
COUCHBASE_BUCKET=_default
COUCHBASE_SCOPE=_default
IS_CLOUD_INSTANCE=true
```

Remember to add .env file to your .gitignore file to avoid accidentally committing sensitive information.

### Generate an ```apollo-couch``` resource 
The apollo-couch package includes a script called generate-resource to help you generate resources in your project. To use this script, follow these steps:

Add a script entry for generate-resource in your project's package.json:


#### Run the generate-resource script:
```bash
npm run generate-resource <resource-name-in-plural>
```

#### Edit the ./src/graphql/resources/`<resource-name-in-plural>`/schema.graphql file. Fill in the properties you want to expose on the resource.

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
Notice that there is no exclamation mark in the `AccountContentPatchInput` input.

#### Create a collection in Couchbase called `<resource-name-in-plural>` and create an index to enable N1QL queries which is used by the list resolver. 

```sql
CREATE PRIMARY INDEX ON main._default.<resource-name-in-plural>;
```

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