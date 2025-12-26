import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_AUTH_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URL!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!,
  }
);

// Client for client credentials flow
// export const kindeApiClient = createKindeServerClient(
//   GrantType.CLIENT_CREDENTIALS,
//   {
//     authDomain: "https://<your_kinde_subdomain>.kinde.com",
//     clientId: "<your_kinde_client_id>",
//     clientSecret: "<your_kinde_client_secret>",
//     logoutRedirectURL: "http://localhost:3000",
//   }
// );

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    console.log({ result });

    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const strigifiedValue =
      typeof value === "string" ? value : JSON.stringify(value);

    setCookie(c, key, strigifiedValue, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    // cookies that are being stored as of now
    ["id_token", "access_token", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});
