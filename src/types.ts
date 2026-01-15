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
    maintainers? : Array<string>,
    repository? : string,
    description? : string
    dist_tags? : {next : string, latest: string}
    deprecated? : string
}
