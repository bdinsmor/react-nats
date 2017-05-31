eslint --ignore-pattern '/public/lib/' public/*.js

aws s3 sync ./public/ s3://analyst.pricedigestsapi.com  --profile pricedigests-deploy
aws s3 cp ./env.prod.js s3://analyst.pricedigestsapi.com/env.js  --profile pricedigests-deploy