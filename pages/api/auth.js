import { AuthorizationCode } from "simple-oauth2";

export default async function handler(req, res) {
  const { MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI } = process.env;

  const client = new AuthorizationCode({
    client: { id: MS_CLIENT_ID, secret: MS_CLIENT_SECRET },
    auth: {
      tokenHost: "https://login.microsoftonline.com/common/oauth2/v2.0"
    }
  });

  const authorizationUri = client.authorizeURL({
    redirect_uri: MS_REDIRECT_URI,
    scope: "XboxLive.signin XboxLive.offline_access"
  });

  res.redirect(authorizationUri);
}