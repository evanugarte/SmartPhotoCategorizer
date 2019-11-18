import { Auth } from "aws-amplify";


export async function getAuthInfo() {
  let x = await Auth.currentUserCredentials();
  return x.data.IdentityId;
}
