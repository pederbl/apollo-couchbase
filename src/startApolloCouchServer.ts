import * as dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { generateTypeDefs } from "./graphql/typeDefs";
import { generateResolvers } from "./graphql/resolvers";
import { getVerifiedPayload } from "./graphql/lib/auth";
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
      const context = {}; 

      if (process.env.AUTH === "true") {
        if (req.headers.authorization) {   
          const jwtToken: string = req.headers.authorization.replace("Bearer ", "");
          console.log("Token: '" + jwtToken + "'"); 
          const payload: JwtPayload = await getVerifiedPayload(jwtToken);
          console.log("Payload:", payload); 
          return {
            auth: payload
          };
        } else if (process.env.AUTH_REQUIRED === "true") {
          throw new Error("No authorization header provided");
        } 
      }
      return context; 
    },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
}
