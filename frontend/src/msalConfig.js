export const msalConfig = {
  auth: {
    clientId: "YOUR_AZURE_APP_CLIENT_ID",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin
  }
};