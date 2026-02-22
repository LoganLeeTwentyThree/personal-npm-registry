import { Timestamp } from 'mongodb';

export type PackageVersionObject = {
    name : string,
    version : string,
    description? : string
    readme? : string,
    dist: {tarball: string}
}

export type PackageRoot = {
    name : string,
    versions : {[version : string] : PackageVersionObject},
    mtime? : Timestamp,
    ctime? : Timestamp,
    maintainers : Array<string>,
    repository? : string,
    description? : string
    'dist-tags' : {[tag : string] : string}
    deprecated? : string
}

export type User = {
    token : string,
    email : string,
    password: string,
    createdAt: Date
}
