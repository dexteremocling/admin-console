import { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();
const USER_POOL_ID = "ca-central-1_1QfxBw6BQ"; // Replace with your actual UserPoolId

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (req.method === "DELETE") {
    try {
      console.log(`Attempting to delete user: ${userId}`);

      await cognito.adminGetUser({ UserPoolId: USER_POOL_ID, Username: userId }).promise();
      await cognito.adminDeleteUser({ UserPoolId: USER_POOL_ID, Username: userId }).promise();

      console.log(`User ${userId} deleted successfully`);
      res.status(200).json({ message: `User ${userId} deleted successfully` });
    } catch (error: any) {
      console.error("Error deleting user from Cognito:", error);
      res.status(error.statusCode || 500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  } else if (req.method === "PUT") {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      console.log(`Updating user ${userId} with new email: ${email}`);

      await cognito.adminUpdateUserAttributes({
        UserPoolId: USER_POOL_ID,
        Username: userId,
        UserAttributes: [{ Name: "email", Value: email }],
      }).promise();

      console.log(`User ${userId} updated successfully`);
      res.status(200).json({ message: `User ${userId} updated successfully` });
    } catch (error: any) {
      console.error("Error updating user from Cognito:", error);
      res.status(error.statusCode || 500).json({
        message: "Failed to update user",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
