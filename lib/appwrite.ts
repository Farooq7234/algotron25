import { Client, Databases } from 'appwrite';
import conf from '../lib/conf.js'
const client = new Client();

client
  .setEndpoint(conf.appwriteUrl) 
  .setProject(conf.appwriteProjectId); 

const databases = new Databases(client);

export { client, databases };
