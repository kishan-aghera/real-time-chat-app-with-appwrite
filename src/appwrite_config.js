import { Account, Client, Databases } from "appwrite";
import { APPWRITE_ENDPOINT_URL, APPWRITE_PROJECT_ID } from "./constants";

const client = new Client();


client.setEndpoint(APPWRITE_ENDPOINT_URL).setProject(APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);

export default client;
