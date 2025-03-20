import { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityServiceProvider } from "aws-sdk";

// Initialize Cognito SDK
const cognito = new CognitoIdentityServiceProvider();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query; // Get the username from the URL

  if (typeof username !== "string") {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (req.method === "DELETE") {
    try {
      // Delete the user from Cognito
      await cognito.adminDeleteUser({
        UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your actual UserPoolId
        Username: username,
      }).promise();

      res.status(200).json({ message: `User ${username} deleted successfully` });
    } catch (error) {
      console.error("Error deleting user from Cognito:", error);
      res.status(500).json({ message: "Failed to delete user", error: (error as Error).message });
    }
  } else if (req.method === "PUT") {
    // For update functionality, handle this as needed
    // Example: Update user's email or other attributes
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await cognito.adminUpdateUserAttributes({
        UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your actual UserPoolId
        Username: username,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
        ],
      }).promise();

      res.status(200).json({ message: `User ${username} updated successfully` });
    } catch (error) {
      console.error("Error updating user from Cognito:", error);
      res.status(500).json({ message: "Failed to update user", error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
