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
    maintainers? : Array<String>,
    repository? : String,
    description? : String
}
