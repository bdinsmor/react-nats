node_modules/.bin/eslint --ignore-pattern '/public/lib/' public/*.js

aws s3 sync ./public/ s3://analyst.pricedigestsapi.com  --profile informa
aws s3 cp ./env.prod.js s3://analyst.pricedigestsapi.com/env.js  --profile informa