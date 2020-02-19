jsdoc2md -c jsdoc.conf.json -f src/expressUtils/*.?js src/httpUtils/*.?js public/javascripts/Models/*.mjs > docs/server.md
jsdoc2md -c jsdoc.conf.json -f public/javascripts/*.mjs public/javascripts/**/*.mjs > docs/client.md 
