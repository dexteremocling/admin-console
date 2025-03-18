import { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import pool from "@/lib/db";  // Ensure this is correct for your DB connection

const cognitoClient = new CognitoIdentityProviderClient({
  region: "ca-central-1", // Replace with your actual region
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;  // Extract the userId from the URL parameter

  if (req.method === "GET") {
    try {
      // Fetch user data from the database by userId
      const [user]: any = await pool.execute(
        "SELECT Id, Label, OrganizationId, IsActive, CognitoId, IsAdmin FROM User WHERE Id = ?",
        [userId]
      );

      // If the user does not exist, return a 404 error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Format the user data to match the expected response format
      const formattedUser = {
        ...user,
        IsActive: user.IsActive[0] === 1,  // Convert Bit(1) to boolean
        IsAdmin: user.IsAdmin[0] === 1,    // Convert Bit(1) to boolean
      };

      return res.status(200).json(formattedUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ message: "Database error", error });
    }
  }

  if (req.method === "PUT") {
    try {
      // Ensure that body contains valid data to update the user
      const { label, isActive, isAdmin } = req.body;

      if (typeof label !== "string" || typeof isActive !== "boolean" || typeof isAdmin !== "boolean") {
        return res.status(400).json({ message: "Invalid data in request body" });
      }

      // Update the user in the database
      await pool.execute(
        "UPDATE User SET Label = ?, IsActive = ?, IsAdmin = ? WHERE Id = ?",
        [label, isActive ? 1 : 0, isAdmin ? 1 : 0, userId]
      );

      // Now, update the Cognito user attributes
      const updateParams = {
        UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your actual Cognito User Pool ID
        Username: userId as string,            // Cognito expects a string here
        UserAttributes: [
          {
            Name: "custom:isActive",
            Value: isActive ? "true" : "false",  // Convert boolean to string
          },
          {
            Name: "custom:isAdmin",
            Value: isAdmin ? "true" : "false",  // Convert boolean to string
          },
        ],
      };

      const command = new AdminUpdateUserAttributesCommand(updateParams);
      await cognitoClient.send(command);

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Error updating user", error });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Delete the user from the database
      await pool.execute("DELETE FROM User WHERE Id = ?", [userId]);

      // Now, delete the user from Cognito
      const deleteParams = {
        UserPoolId: "ca-central-1_1QfxBw6BQ", // Replace with your actual Cognito User Pool ID
        Username: userId as string,            // Cognito expects a string here
      };

      const command = new AdminDeleteUserCommand(deleteParams);
      await cognitoClient.send(command);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Error deleting user", error });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
