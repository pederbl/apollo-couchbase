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
  if (!process.env.TOKEN_ISSUER) {
    throw new Error("JWT_SECRET environment variable is empty.")
  }
  return <PayloadT>jwt.verify(token, process.env.TOKEN_ISSUER);
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

/*
// From the curity setup, ask morre. Should probably be moved to env
const ISSUER = 'https://dlindau.ngrok.io/~';
const JWKS_URI = ISSUER + '/jwks';

// import jwksClient from 'jwks-rsa'
// import jwt from 'jsonwebtoken'
const jwksClient = require('jwks-rsa');
const jwks = jwksClient({ jwksUri: JWKS_URI });

// field for caching the key
let signingKey = undefined;
const getVerifiedPayload = (token) => {
  // Some options for the verification. Expiration and signature is on by default
  let options = { issuer: ISSUER };

  const getKey = (jwtHeader, callback) => {
    if (signingKey) {
      console.info('Using cached key');
      callback(null, signingKey);
      return;
    }

    jwks.getSigningKey(jwtHeader.kid, (err, key) => {
    console.info('Fetching key with id: ' + jwtHeader.kid);
    if (err) {
        console.error('Error fetching key: ' + err)
        callback(err, null);
    }
    signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
    });
  };

  const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
  jwt.verify(token, getKey, options, (err, decoded) => err ? reject(err) : resolve(decoded));
  });
  }
  return new Promise((resolve, reject) => {
  verifyToken(token)
  .then((res) => resolve(res))
  .catch((err) => reject(err));
  });
};
*/
