# Apollo On The Couch
A framework for building GraphQL APIs with the Apollo GraphQL server backed by Couchbase. 

The main inspiration for this framework is Ruby On Rails which was a game-changer when it came. But, Ruby On Rails has five huge sub-optimalities that  
Apollo On The Couch aims to fix: 
1. Scalability: It didn't scale seamlessly from start up to millions of operations per second. 
2. Reliability: It required lots of infrastructure work to become enterprise-grade reliable.
3. Capability: It didn't support full-text search and analytics out-of-the-box. 
4. Cost-effectiveness: It required a lot of infrastructure work to be able to run cost-effectively. 
5. REST vs GraphQL: It's default API was REST which is sub-optimal in so many ways compared to GraphQL. 

With Apollo On The Couch you get all of the benefits with the Ruby On Rails approach and all of the above mentioned sub-optimalities fixed out-of-the-box with amazing developer and devops experience all the way from startup to millions of operations per second.

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
Choose if you'd like to activate access control and if you want to require a JWT token to be sent as an authorization header in all requests. 
```bash
AUTH=true
AUTH_ALL=false
AUTH_TOKEN_ISSUER=https://<Your Identity Provider>
AUTH_TOKEN_AUDIENCE=<Your client id>
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
npm run generate-resource products
```

#### Edit the ./src/graphql/resources/`<resourceNameInPlural>`/schema.graphql file. Fill in the properties you want to expose on the resource.
E.g.
```graphql
type ProductContent {
    name: String!
    price: Float
    quantity: Int
    tags: [String!]!
}

input ProductContentInput {
    name: String!
    price: Float
    quantity: Int
    tags: [String!]!
}

input ProductContentPatchInput {
  name: String
  ISBN: Int
}

input ProductsListFiltersInput {
  name: String
}
```
Notice that there is no exclamation mark in the `ProductContentPatchInput` input, since you probably don't want to require any field to be included when patching records. 

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
