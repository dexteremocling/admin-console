import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your User Pool ID
  ClientId: "155akh026078col2s3ub00mei6", // Replace with your App Client ID
};

export default new CognitoUserPool(poolData);
