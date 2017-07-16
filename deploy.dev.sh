node_modules/.bin/eslint --ignore-pattern '/public/lib/' public/*.js

aws s3 sync ./public/ s3://analyst-dev.pricedigestsapi.com  --profile pricedigests-deploy
aws s3 cp ./env.dev.js s3://analyst-dev.pricedigestsapi.com/env.js  --profile pricedigests-deploy