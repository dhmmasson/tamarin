# Capuchin

Follow up to the famous Rezbuild-baboon project with an all new UI.

## install

1. Clone the project from : https://github.com/dhmmasson/rezbuild-emperor-tamarin.git
1. Create the database and populate the database
    1. Create an empty database on mysql
    2. Import db/structure_*.sql ( you may have to reorder the elements )
    3. import dataset db/*dataset*.sql
1. rename .env.exemple .env and modify .env file with database information (host, name, user, password)
1. install libraries : npm install
1. test by launching the app : npm start

## development

1. install nodemon : npm install nodemon
1. launch the app :
  * nodemon ./bin/www.mjs
  * Or a better version :
  * nodemon -i public/javascripts -e js,pug,mjs,cjs bin/www.mjs
