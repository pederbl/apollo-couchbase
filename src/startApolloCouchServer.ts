import * as dotenv from "dotenv"; 
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { generateTypeDefs } from "./graphql/type-defs";
import { generateResolvers } from "./graphql/resolvers";
import { Resolvers } from "./graphql/generated-types";

dotenv.config();

export interface MyContext {};

export async function startApolloCouchServer(port?: number, customTypeDefs?: string, customResolvers?: Resolvers) {

  const typeDefs = await generateTypeDefs(customTypeDefs);
  const resolvers = await generateResolvers(); 

  const server = new ApolloServer<MyContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer<MyContext>(server, {
      listen: { port: port || 4000 },
      context: async () => {
          return {};
      }
  });
  
  console.log(`🚀  Server ready at: ${url}`);
}

