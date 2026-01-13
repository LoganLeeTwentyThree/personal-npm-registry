# personal-npm-registry
This an implementation of the [CommonJS Registry Specification](https://wiki.commonjs.org/wiki/Packages/Registry) that aims to work with [npm](https://www.npmjs.com/). 

## How to use
There are a few prerequisites for setting up the server.  
1. MongoDB Atlas Database - The server is currently designed to store package metadata and user tokens on a mongodb atlas database
2. AWS s3 credentials - The server stores package tarballs in an s3 bucket.
3. Auth0 - The server relies on auth0 for user authentication  
  
### Setup Steps
1. Clone this repository  
`git clone https://github.com/LoganLeeTwentyThree/personal-npm-registry`
2. Create `.env.local` in the root of the project
   - There are a few environment variables that need to be filled out
   - AUTH0
     - AUTH0_DOMAIN (Provided by Auth0)
     - AUTH0_CLIENT_ID (Provided by Auth0)
     - AUTH0_CLIENT_SECRET (Provided by Auth0)
     - AUTH0_SECRET (Provided by Auth0)
   - MongoDB
     - DATABASE_STRING (Provided by MongoDB Atlas)
   - S3
     - S3_BUCKET (This is the name of your S3 bucket)
     - Additionally, login with the [aws cli](https://aws.amazon.com/cli/)
   - Other
     - APP_BASE_URL (likely "http://localhost:3000")
3. Run dev server  
`npm run dev`

### Use With npm
Set the server as your registry on npm  
`npm config set registry <SERVER-IP>`

## Features
### Working
`login`  
`publish`  
`install`  
  
### In Development  
Frontend Package Browser

### Planned
- all the other npm commands
- browserless `login`
- built-in oauth (no auth0)
- easy configuration
- mongoose data schema 
- cloudless version (stretch goal)
