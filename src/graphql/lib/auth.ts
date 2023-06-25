import jwt, { JwtPayload } from "jsonwebtoken";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { DbUser, Role } from "../../couchbase/models/users";

export interface DefaultJwtPayload extends JwtPayload {
  sub: string,
  firstName: string, 
  lastName: string,
  email: string,
  roles: Role[]
}

export function createJwtPayload(user: DbUser): DefaultJwtPayload {
  return {
    sub: user.id,
    firstName: user.content.firstName, 
    lastName: user.content.lastName,
    email: user.content.email,
    roles: user.content.roles
  }
}

export function createJwtToken<PayloadT = DefaultJwtPayload>(payload: PayloadT): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is empty.")
  }
  return jwt.sign(<JwtPayload>payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJwtToken<PayloadT = DefaultJwtPayload>(token: string): PayloadT {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is empty.")
  }
  return <PayloadT>jwt.verify(token, process.env.JWT_SECRET);
}

const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function verifyGoogleJwtToken(token: string): Promise<TokenPayload> {
  try {
    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Payload is undefined.");
    }
    return payload;
  } catch (error) {
    throw new Error(`Error verifying Google token: ${error}`);
  }
}

