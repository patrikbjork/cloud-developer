// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'a667shbuc4'
export const apiEndpoint = `https://${apiId}.execute-api.eu-north-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-jyv2wd64.eu.auth0.com',            // Auth0 domain
  clientId: 'RzXu3vlA71u7SoPvbv6f7Q832bLYs236',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
