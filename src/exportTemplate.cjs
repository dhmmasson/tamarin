const {resolve} = require("path"); 
const updateTemplate = require('./expressUtils/updateTemplate.cjs') ;
updateTemplate(
    resolve(process.cwd(), "views/partials"),
    resolve(process.cwd(), "public/javascripts")
);
