# Billy - Backend API 

### (Rename all the necessary fields to meet the API requirements)

## Install software

- node 16.x
- npm 8.x
- mongodb 4.x  https://www.mongodb.com/download-center?ct=false#community

## Local deployment

First, you need startup mongodb , modify *db.*url in *config/default.js* for your db url(you don't need to modify it if you startup mongodb with default config in local).

1. open terminal to project root dir ,Install node dependencies using `npm install`.
2. check code with `npm run lint`.
3. create static test data run `npm run addData`, **it will drop all tables and create tables.**
4. run server `npm run start`.
5. enable it https://myaccount.google.com/lesssecureapps , and open config/default.js , enter your gmail user and pass at email.auth.

## Email Configuration

- set email configuration in `config/default.js`
- host: the email smtp host
- port: port
- user: email address
- pass: password

## Postman and Swagger

- Please go to `docs` folder, the postman collection and swagger definition is there.