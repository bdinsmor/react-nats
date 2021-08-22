rm -rd build
mkdir build 
cp -r ./public/* ./build
API_URL="https://internal-api-primary.services-us-east-1-v2.development.pricedigestsapi.com" envsubst < env.js > build/env.js
http-server build