"use client"

import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeCodeGroup from "rehype-code-group"
import Markdown from 'react-markdown'
import { useState } from "react";
import { PackageRoot } from "@/types";
import '../app/globals.css'

interface PackageBrowserProps {
    packages : PackageRoot[]
}

export default function PackageBrowser( {packages} : PackageBrowserProps)
{

    const [selectedPackage, setSelectedPackage] = useState<PackageRoot | null>(null)
    const [searchField, setSearchField] = useState("")

    return (
    <div className='h-full'>
        <div className="bg-white h-fit border-b border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center px-6 py-3 gap-4">
                <img src="/favicon.png" className="w-12 h-12 rounded-lg object-contain"/>
                <input 
                    onChange={(e) => setSearchField(e.target.value)} 
                    id="search" 
                    className="h-10 flex-1 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all text-sm" 
                    placeholder="Search Packages..."
                />
            </div>
        </div>
        <div className="grid grid-cols-12 gap-0 h-full">
            <div className="col-span-2 bg-white border-r border-gray-200 shadow-sm">
                <div className='text-center text-xs font-semibold uppercase tracking-widest text-gray-500 bg-gray-50 py-2 border-b border-gray-200'>
                    Packages
                </div>
                <div className="flex flex-col bg-white w-full overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
                    {packages.map((element, id) => {
                        if (element.name.includes(searchField)) {
                            return (
                                <div 
                                    key={id}
                                    className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-gray-100 transition-colors truncate"
                                    onClick={() => setSelectedPackage(element)}
                                >
                                    {element.name}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            <div className="col-span-10 bg-gray-50 w-full overflow-y-scroll overflow-x-hidden [scrollbar-width:none]">
                {selectedPackage != null && 
                <div className="flex flex-col divide-y divide-gray-100 m-6 mb-30 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="text-4xl font-bold text-gray-800 px-8 py-6">{selectedPackage?.name}</div>
                        {selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description != null && 
                            <div className="px-8 py-6">
                                <div className="text-xl font-semibold text-gray-700 mb-3">Description</div>
                                <div className="text-gray-600 text-sm leading-relaxed">
                                    <Markdown>{selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description}</Markdown>
                                </div>
                            </div>
                        }
                        {selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].description != null && 
                            <div className="px-8 py-6">
                                <div className="text-xl font-semibold text-gray-700 mb-3">Readme</div>
                                <div className="prose prose-sm max-w-none text-gray-600 reactMarkDown">
                                    <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeCodeGroup]}>{selectedPackage?.versions[Object.keys(selectedPackage?.versions!).at(-1) as string].readme}</Markdown>
                                </div>
                            </div>
                        }   
                    <div className="px-8 py-6">
                        <div className="text-xl font-semibold text-gray-700 mb-3">Versions</div>
                        <div className='flex flex-col gap-1'>
                            {Object.keys(selectedPackage.versions).map((e, i) => (
                                <div key={i} className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-1 rounded-md w-fit border border-gray-200">{e}</div>
                            ))}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    </div>
);
}