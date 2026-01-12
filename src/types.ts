import { Timestamp } from 'mongodb';

export type PackageVersionObject = {
    name : String,
    version : String,
    dist: {tarball: String}
}

export type PackageRoot = {
    name : String,
    versions : Array<{version : string, url : string}>,
    mtime? : Timestamp,
    ctime? : Timestamp,
    maintainers? : Array<String>,
    repository? : String,
    description? : String
}
