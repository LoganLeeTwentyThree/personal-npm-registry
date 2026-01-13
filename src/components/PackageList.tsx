"use client"

import { PackageRoot } from "@/types";

interface PackageListProps {
    packages : PackageRoot[]
}

export default function PackageList( {packages} : PackageListProps)
{
  return (
    <div className="divide-y divide-gray-200 flex flex-col items-center bg-white rounded-xl w-full h-fit">
        {packages.map((element, id) => (
          <div 
            key={id}
            className=" w-full hover:bg-gray-100 text-center"
            >
            {element.name}</div>
        ))}
    </div>
  );
}