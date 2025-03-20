import { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityServiceProvider } from "aws-sdk";

// Set up the Cognito Identity Provider client
const cognito = new CognitoIdentityServiceProvider({
  region: "ca-central-1", // Region for your Cognito User Pool
});

interface CognitoUser {
  Username: string;
  Attributes: { Name: string; Value: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Fetch list of users from Cognito User Pool
    const data = await cognito.listUsers({
      UserPoolId: "ca-central-1_1QfxBw6BQ", // Your User Pool ID
      Limit: 60, // Optional: Limit the number of users returned
    }).promise();

    // Check if 'Users' property exists in the response
    if (!data.Users) {
      return res.status(404).json({ message: "No users found in Cognito" });
    }

    // Map the response to the desired format for the frontend
    const formattedUsers = data.Users.map((user: any) => ({
      Username: user.Username,
      Attributes: user.Attributes.reduce((acc: any, attr: any) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {}),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users from Cognito:", error);
    res.status(500).json({ message: "Error fetching users from Cognito", error: error instanceof Error ? error.message : error });
  }
}
