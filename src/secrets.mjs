import dotenv from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export const SetUpEnvironment = async () => {
  if (process.env.NODE_ENV === "development") {
    dotenv.config();
  } else {
    // Instantiates a client
    const client = new SecretManagerServiceClient();
    const name = "mysql-projects/411923472590/secrets/mysql-credential";

    const [version] = await client.accessSecretVersion({
      name: name,
    });

    // Extract the payload as a string.
    const payload = version.payload.data.toString("utf8");
    const mysqlCredentials = JSON.parse(payload);
    //add them to the environment
    process.env.mysqlHost = mysqlCredentials.mysqlHost;
    process.env.mysqlUser = mysqlCredentials.mysqlUser;
    process.env.mysqlPassword = mysqlCredentials.mysqlPassword;
    process.env.mysqlDatabase = mysqlCredentials.mysqlDatabase;
  }
};
