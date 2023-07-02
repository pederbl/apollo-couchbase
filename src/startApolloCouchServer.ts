import * as dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { generateTypeDefs } from "./graphql/typeDefs";
import { generateResolvers } from "./graphql/resolvers";
import { verifyJwtToken } from "./graphql/lib/auth";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

export interface MyContext {
  auth?: JwtPayload
};

export async function startApolloCouchServer() {
  const PORT: number = parseInt(process.env.PORT || "4000");

  const typeDefs = await generateTypeDefs();
  const resolvers = await generateResolvers(); 
  const server = new ApolloServer<MyContext>({ typeDefs, resolvers });
  const { url } = await startStandaloneServer<MyContext>(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      if (!req.headers.authorization) {
        return {};
      }
 
      // const jwtToken: string = req.headers.authorization.replace("Bearer ", "");
      // const payload: JwtPayload = verifyJwtToken(jwtToken);

      return { };
    },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
}
