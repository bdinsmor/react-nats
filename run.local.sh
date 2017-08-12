rm -rd build
mkdir build 
cp -r ./public/* ./build
cp env.local.js ./build/env.js
./node_modules/.bin/http-server build