import { auth0 } from "@/lib/auth0";
import { PackageRoot } from "@/types";

const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { cookies } from 'next/headers'
import LoginButton from "@/components/LoginButton";
import { insertUser } from "@/lib/database";
import PackageBrowser from "@/components/PackageBrowser";

export default async function Home({
  searchParams,
}: {
  searchParams: { [id: string]: string | undefined };
}) {
  dotenv.config({ path: '../../.env.local' })
  const session = await auth0.getSession();
  const user = session?.user;

  
  const uuid = (await searchParams).id
  const cookieStore = await cookies()

  //first visit to home page after logging in 
  if(cookieStore.get("id") != null && user != null)
  {
    const uri = process.env.DATABASE_STRING; 
    const client = new MongoClient(uri);

    try {
      // try to update temp-uuid so that npm can get its token
      const check = await client.db('private-npm').collection('temp-uuids').updateOne({token: cookieStore.get("id")?.value, status: "pending"}, { $set: { status: "complete"}})
      
      //if there was a matching temp-uuid, insert the new user into the db
      if(check.modifiedCount == 1)
      {
        //try to insert new user into db 
        await insertUser(cookieStore.get("id")?.value, user)
      }
    } finally {
      await client.close();
    }
  }

  if( uuid != undefined)
  {
    return (
      <div>
        <LoginButton id={uuid as string}/>
      </div>
    )
  }else{
    
    const uri = process.env.DATABASE_STRING;
    
    const client = new MongoClient(uri);
    var result : Array<PackageRoot>

    try {
      const database = client.db('private-npm');
      const roots = database.collection('package-roots');

      result = await roots.find().toArray()
      result = result.map((e : PackageRoot) => {
        return {
          name: e.name,
          versions: e.versions
        }
      });
    } finally {
      await client.close();
    }
    
    return (
      <PackageBrowser packages={result}/>
    )
  }
  
  
}