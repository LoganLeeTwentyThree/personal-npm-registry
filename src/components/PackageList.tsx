import { PackageRoot } from "@/types";

interface PackageListProps {
    packages : PackageRoot[]
}

export default async function PackageList( {packages} : PackageListProps)
{
  return (
    <div className="divide-y divide-gray-200 flex flex-col items-center bg-white rounded-xl w-50 h-fit overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
        {packages.map((element, id) => (
          <div 
            key={id}
            className=" w-50 text-center"
            >
            {element.name}</div>
        ))}
    </div>
  );
}