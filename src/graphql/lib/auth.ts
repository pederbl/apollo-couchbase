import JWTValidator, { PublicKeySettings } from "@curity/jwt-validation";

const allowed_jwt_algorithms= ['RS256', 'ES384'];

const options2 = {
  //    accessToken     : "<accessToken>",     // Replace with your accessToken
  //    state           : "<state>",           // Replace with your state
  //    nonce           : "<nonce>",           // Replace with your nonce
     ignoreExpiration: true,                // optional, default false
  //    ignoreNotBefore : true,                // optional, default false
  //    clockTolerance  : 0,                   // optional, default 0 seconds
  //    subject         : 'test',              // optional, if provided, then jwt.sub should match it
  //    jti             : 'jti-value',         // optional, if provided, then jwt.jti should match it
  //    code            : 'authorize-code'     // optional, pass it if you want to validate c_hash
  };

export async function getVerifiedPayload(jwtString: string): Promise<JWTValidator.JWTPayload> {
  const ISSUER = process.env.AUTH_TOKEN_ISSUER;
  if (!ISSUER) {
    throw new Error("AUTH_TOKEN_ISSUER environment variable not set");
  }

  const jwt_sig_public_key: PublicKeySettings = {   
      format: 'issuer', 
      value: ISSUER
  };

  const jwtValidator = new JWTValidator(
      ISSUER,
      "www",
      allowed_jwt_algorithms,
      jwt_sig_public_key,
  );

  return await jwtValidator.verifyJWT(jwtString, options2);
}

export type JwtPayload = {
  [key: string]: string | object
}


