import { AuthorizationCode } from "simple-oauth2";

export default async function handler(req, res) {
  const { code } = req.query;
  const { MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI } = process.env;

  const client = new AuthorizationCode({
    client: { id: MS_CLIENT_ID, secret: MS_CLIENT_SECRET },
    auth: {
      tokenHost: "https://login.microsoftonline.com/common/oauth2/v2.0"
    }
  });

  try {
    const tokenParams = {
      code,
      redirect_uri: MS_REDIRECT_URI,
      scope: "XboxLive.signin XboxLive.offline_access"
    };

    const accessToken = await client.getToken(tokenParams);
    console.log("Access Token Received:", accessToken.token);

    // Redirect back to home after auth
    res.redirect("/");
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
}