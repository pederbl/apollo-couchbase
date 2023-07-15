# Apollo On The Couch

A framework for building GraphQL APIs with the Apollo GraphQL server backed by Couchbase. The main purpose of this 
framework is to make it simple to build super scalable and reliable APIs quickly and cost-effectively. 

## Getting Started

### Prerequisites 
* [A Couchbase Capella account or your own Couchbase server.](https://www.couchbase.com/downloads) 
* [Node.js](https://nodejs.org/en/download) (Only tested with version: v18.12.1. I heard there where some issues with v20, which is on the roadmap to fix.)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or similar

### Create Your `Apollo On The Couch` Server Project

#### Create a Typescript project with the appropriate dependencies.
```bash
npx create-apollo-couchbase-server@latest my-server
```

#### Configure the Couchbase Environment Variables in the .env file
Set the username and password of your Couchbase user. 
```bash
COUCHBASE_USER=username
COUCHBASE_PASSWORD=password
```

### Generate a resource 
In `apollo-couchbase`, the GraphQL schema and resolvers are structured in units called `resources`. A resource will typically be similar to a REST resource, with CrUD operations, but it can really be whatever kind of group of functions that makes sense for your purposes.  

If you want your resource to be similar to a typical REST resource you can use the scaffolding script, `generate-resource`, to generate a new resource. This script will generate resources with scaffold resolvers and schema files that you can edit to fit your purposes. You can also choose to create your resources manually if you want a different structure. 

To create a resource using the scaffolding script, follow these steps:

#### Run the generate-resource script:
```bash
npm run generate-resource <resourceNameInPlural>
```

E.g
```bash
npm run generate-resource customers
```

#### Edit the ./src/graphql/resources/`<resourceNameInPlural>`/schema.graphql file. Fill in the properties you want to expose on the resource.
E.g.
```graphql
type CustomerContent {
    name: String!
    phone: String
}

input CustomerContentInput {
  name: String!
  phone: String
}

input CustomerContentPatchInput {
  name: String
  phone: String
}

input CustomersListFiltersInput {
  name: String
}
```
Notice that there is no exclamation mark in the `CustomerContentPatchInput` input, since you probably don't want to require any field to be included when patching records. 

This script with create a collection in Couchbase if it didn't already exist and a primary index on that collection. 

#### Edit the ./src/graphql/resources/`<resourceNameInPlural>`/schema.graphql file. Fill in the properties you want to expose on the resource.
After editing a schema file you need to run the generate-graphql-types script to update the Typescript types:
```bash
npm run generate-graphql-types
```

### Start the server
Now, you are ready to start the server. 

```bash
npm run dev
```

## License
This project is licensed under the ISC License. See the LICENSE file for details.
