import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_3FbvJuTzb",
  ClientId: "4bfj9qceicuupv4ivp41d1bj3g",
};

export default new CognitoUserPool(poolData);
