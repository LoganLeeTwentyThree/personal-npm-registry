"use client"

import { PackageRoot } from "@/types";

interface PackageListProps {
    _package : PackageRoot
}

export default async function PackageList( {_package} : PackageListProps)
{
  return (
    <div className="divide-y divide-gray-200 flex flex-col items-center bg-white rounded-xl w-full h-fit">
        
    </div>
  );
}