rm -rd build
mkdir build 
cp -r ./public/* ./build
cp env.local.js ./build/env.js
http-server build