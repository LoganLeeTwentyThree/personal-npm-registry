# personal-npm-registry
This an implementation of the [CommonJS Registry Specification](https://wiki.commonjs.org/wiki/Packages/Registry) that aims to work with [npm](https://www.npmjs.com/). 

## How to use
There is one prerequisites for setting up the server.  
1. AWS s3 credentials - The server stores package tarballs in an s3 bucket.
  
### Setup Steps
1. Clone this repository  
`git clone https://github.com/LoganLeeTwentyThree/personal-npm-registry`
2. Create `.env` in the root of the project
    - S3_BUCKET (This is the name of your S3 bucket)
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - AWS_REGION
3. Run with docker compose
`docker compose up`

### Use With npm
Set the server as your registry on npm  
`npm config set registry <SERVER-IP>`

## Features
### Working
`npm login`  
`npm publish`  
`npm unpublish`  
`npm install`
`npm deprecate`
User Authorization
  
### In Development  
Frontend Package Browser  

### Planned
- all the other npm commands
- browserless `login`
- built-in oauth (no auth0)
- easy configuration
- mongoose data schema 
