import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../config/env";

// Validates the RS256 JWT issued by Auth0 on every protected request.
// Rejects with 401 when the token is missing, expired, or the
// audience / issuer does not match.
export const checkJwt = auth({
  audience: env.auth0Audience,
  issuerBaseURL: `https://${env.auth0Domain}/`,
  tokenSigningAlg: "RS256",
});
