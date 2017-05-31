eslint --ignore-pattern '/public/lib/' public/*.js

aws s3 sync ./public/ s3://analyst.staging.pricedigestsapi.com  --profile pricedigests-deploy
aws s3 cp ./env.staging.js s3://analyst.staging.pricedigestsapi.com/env.js  --profile pricedigests-deploy