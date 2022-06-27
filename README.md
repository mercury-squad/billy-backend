# Billy - Backend API

### (Rename all the necessary fields to meet the API requirements)

## Install software

- node 16.x
- npm 8.x
- mongodb 4.x https://www.mongodb.com/download-center?ct=false#community

## Local deployment

First, you need startup mongodb , modify *db.*url in _config/default.js_ for your db url(you don't need to modify it if you startup mongodb with default config in local).

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

- Please go to [Postman Documentation](https://mercury-squad.postman.co/workspace/Team-Workspace~b192650a-fb76-44ac-847b-546089ecc1eb/collection/4375009-80fd01b6-93f9-4f85-9a4b-42d6a3cb57b3?ctx=documentation) folder, the postman collection and documentation is there.
