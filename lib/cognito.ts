import { CognitoUserPool } from "amazon-cognito-identity-js";
import { config } from "aws-sdk";

// Set the region for the AWS SDK (important for CognitoIdentityServiceProvider)
config.update({ 
  region: "ca-central-1", // Your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set from environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set from environment variable
 });

const poolData = {
  UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your User Pool ID
  ClientId: "155akh026078col2s3ub00mei6", // Replace with your App Client ID
};

export default new CognitoUserPool(poolData);
