# personal-npm-registry
This an implementation of the [CommonJS Registry Specification](https://wiki.commonjs.org/wiki/Packages/Registry) that aims to work with [npm](https://www.npmjs.com/). 

## How to use
There are a few prerequisites for setting up the server.  
1. MongoDB Atlas Database - The server is currently designed to store package metadata and user tokens on a mongodb atlas database
2. AWS s3 credentials - The server stores package tarballs in an s3 bucket.
3. Auth0 - The server relies on auth0 for user authentication  
  
### Steps
1. Clone this repository
`git clone https://github.com/LoganLeeTwentyThree/personal-npm-registry`
2. Create `.env.local` in the root of the project
   - Put mongodb, auth0, and aws credentials in here
3. Run dev server
`npm run dev`
4. Set the server as your registry on npm
`npm config set registry <SERVER-IP>`

# Working
login  
publish  
  
# In Development  
install  

# Planned
all the other npm commands -_-
