"use client"

import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import Markdown from 'react-markdown'
import { useState } from "react";
import { PackageRoot } from "@/types";

interface PackageBrowserProps {
    packages : PackageRoot[]
}

export default function PackageBrowser( {packages} : PackageBrowserProps)
{

    const [selectedPackage, setSelectedPackage] = useState<PackageRoot | null>(null)
    const [searchField, setSearchField] = useState("")

    return (
        <div className='h-full'>
            <div className="bg-white h-fit border-b border-default">
                <div className="w-screen flex flex-wrap items-center justify-left mx-1 p-4">
                    <img src="/favicon.ico" className="aspect-ratio-1/1 w-15 mx-8"/>
                    <input onChange={(e) => setSearchField(e.target.value)} id="search" className="h-10 w-[100% - 40px] grow bg-gray-100 p-3 rounded-xl mx-5" placeholder="Search Packages..."></input>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-0 h-full">
                <div className="col-span-1 bg-white">
                    <div className='text-center bg-gray-100'>Packages</div>
                    <div className="divide-y divide-gray-200 flex flex-col items-center bg-white rounded-xl w-full h-fit overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
                        {packages.map((element, id) => {

                            if(element.name.includes(searchField))
                            {
                                return(
                                    <div 
                                    key={id}
                                    className="w-full hover:bg-gray-200 hover:scale-105 text-center"
                                    onClick={() => setSelectedPackage(element)}
                                    >
                                        {element.name}
                                    </div>
                                )
                            }
                            })}
                    </div>
                </div>
                <div className="col-span-11 bg-gray-300 w-full overscroll-none overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
                    {selectedPackage != null && 
                    <div className="flex flex-col divide-y divide-gray-200 m-5 bg-white">
                        <div className="text-5xl p-5">{selectedPackage?.name}</div>
                            {selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description != null && 
                                <div className="p-5">
                                    <div className="text-3xl pb-2">Description</div>
                                    <Markdown >{selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description}</Markdown>
                                </div>
                            }
                        
                            {selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description != null && 
                                <div className="p-5">
                                    <div className="text-3xl pb-2">Readme</div>
                                    <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].readme}</Markdown>
                                </div>
                            }   
                        
                        <div className="p-5">
                            <div className="text-3xl pb-2">Versions</div>
                            <div className='text-xl'>{Object.keys(selectedPackage.versions).map((e, i) => (<div key={i}>{e}</div>))}</div>
                        </div>
                    </div>}
                    
                    
                </div>
            </div>
        </div>
    );
}