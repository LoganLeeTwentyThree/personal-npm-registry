import { PackageRoot } from "@/types";
const { MongoClient } = require('mongodb');
import LoginPage from "@/components/LoginPage"
import { headers } from "next/headers";
import PackageBrowser from "@/components/PackageBrowser";

export default async function Home({
  searchParams,
}: {
  searchParams: { [id: string]: string | undefined };
}) {
    
  const uri = process.env.DATABASE_STRING;
  
  var result : Array<PackageRoot>

  const id = (await searchParams).id
  if( id )
  {
    const client = new MongoClient(uri);
    try {
      const database = client.db('private-npm');
      const uuids = database.collection('temp-uuids');

      result = await uuids.findOne({ token: id, status: "pending"})

      if(result)
      {
        return (<LoginPage id={id}/> )
      }
    
    } finally {
      await client.close();
    }
  }

  const client = new MongoClient(uri);
  try {
    
    const database = client.db('private-npm');
    const roots = database.collection('package-roots');

    result = await roots.find().toArray()
    result = result.map((e : PackageRoot) => {
      return {
        name: e.name,
        versions: e.versions,
        'dist-tags': e['dist-tags'],
        maintainers: e.maintainers
      }
  });
  } finally {
    await client.close();
  }
  
  return (
    <PackageBrowser packages={result}/>
  )
  
  
  
}