# Apollo Couch

A framework for building an Apollo GraphQL API backed by Couchbase.

## Installation

```bash
npm install apollo-couch
```

## Features
Simplifies building Apollo GraphQL APIs backed by Couchbase.

## Configuring Couchbase Environment Variables
To configure the Couchbase connection, you need to set the following environment variables:

COUCHBASE_USER: The username for the Couchbase server.
COUCHBASE_PASSWORD: The password for the Couchbase server.
COUCHBASE_ENDPOINT: (Optional) The Couchbase server endpoint. If not provided, it defaults to localhost.
IS_CLOUD_INSTANCE: (Optional) Set this to 'true' if you are connecting to a cloud instance of Couchbase. If not provided, it defaults to 'false'.

You can set these environment variables in a .env.local file in the root directory of your project or set them directly in your system's environment variables.

Example .env.local file:
```makefile
COUCHBASE_USER=my_user
COUCHBASE_PASSWORD=my_password
COUCHBASE_ENDPOINT=my_couchbase_instance.com
IS_CLOUD_INSTANCE=true
```
Remember to add .env.local to your .gitignore file to avoid accidentally committing sensitive information.

## Generating Resources
The apollo-couch package includes a script called generate-resource to help you generate resources in your project. To use this script, follow these steps:

Add a script entry for generate-resource in your project's package.json:
```json
"scripts": {
  "generate-resource": "generate-resource"
}
````

Run the generate-resource script:
```bash
npm run generate-resource <resource-name-in-plural>
````

This command will execute the generate-resource script from the apollo-couch package.

## Documentation
TODO: Add a link to detailed documentation, or provide inline documentation for all public functions and classes.

## Contributing
TODO: Add information on how to contribute to the project, such as reporting bugs, submitting feature requests, or creating pull requests.

## License
This project is licensed under the ISC License. See the LICENSE file for details.