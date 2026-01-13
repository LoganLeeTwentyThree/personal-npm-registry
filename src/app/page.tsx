import { auth0 } from "@/lib/auth0";
import PackageList from "@/components/PackageList";
import { PackageRoot } from "@/types";

const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { cookies } from 'next/headers'
import LoginButton from "@/components/LoginButton";
const crypto = require('crypto');
import { generateTokenFromUUID, insertUser } from "@/lib/database";

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


      //update temp-uuid so that npm can get its token
      const check = await client.db('private-npm').collection('temp-uuids').updateOne({token: cookieStore.get("id")?.value, status: "pending"}, { $set: { status: "complete"}})

      if(check.modifiedCount == 1)
      {
        //try to insert new user into db 
        await insertUser(cookieStore.get("id")?.value, user.name, user)
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
      <div>
        <nav className="bg-white sticky top-0 w-full z-20 border-b border-default">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-left mx-1 p-4">
            <img src="/favicon.ico" className="aspect-ratio-1/1 w-15 mx-8"/>
            <input id="search" className="h-10 w-[100% - 40px] grow bg-gray-100 p-3 rounded-xl mx-5" placeholder="Search Packages..."></input>
            <button className="grow-0 h-10 w-40 bg-blue-100 p-3 mx-5 rounded-xl hover:bg-blue-200">Packages</button>
            <button className="grow-0 h-10 w-40 bg-blue-100 p-3 mx-5 rounded-xl hover:bg-blue-200">More Stuff</button>  
            <button className="grow-0 h-10 w-40 bg-blue-100 p-3 mx-5 rounded-xl hover:bg-blue-200">Even More Stuff</button>
          </div>
        </nav>
        <div className="h-screen grid grid-cols-12 gap-0">
          <div className="col-span-1 bg-white overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
            <PackageList packages={result} />
          </div>
          <div className="col-span-11 bg-gray-300 w-full"></div>
        </div>
        
      </div>
      
    )
  }
  
  
}