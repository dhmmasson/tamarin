import { autoLocals, autoRoute, mysqlConnector, updateTemplate } from "./src/expressUtils/index.mjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import errorHandler from "./routes/_error.js";
import express from "express";
import logger from "morgan";
import path from "path";
//stimport sassMiddleware from "node-sass-middleware" ;


dotenv.config();
const app = express();
if (app.get("env")) app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** Use scss on demand */
// app.use( sassMiddleware(
//   { src            : path.join( process.env.PWD, "public" )
//   , dest           : path.join( process.env.PWD, "public" )
//   , indentedSyntax : false // .scss
//   , sourceMap      : true
//   } ) ) ;

updateTemplate(path.resolve(process.env.PWD, "views/partials")
  , path.resolve(process.env.PWD, "public/javascripts"));

/** Static routes : css, images, and app js*/
app.use(express.static(path.join(process.env.PWD, "public")));

/** Static routes : libraries */
app.use("/javascripts", express.static(path.join(process.env.PWD, "node_modules/jquery/dist")));
app.use("/javascripts", express.static(path.join(process.env.PWD, "node_modules/materialize-css/dist/js")));
app.use("/javascripts", express.static(path.join(process.env.PWD, "node_modules/@svgdotjs/svg.draggable.js/dist")));
app.use("/javascripts", express.static(path.join(process.env.PWD, "node_modules/@svgdotjs/svg.js/dist")));
app.use("/javascripts", express.static(path.join(process.env.PWD, "node_modules/papaparse")));

app.use("/fonts", express.static(path.join(process.env.PWD, "node_modules/materialize-css/dist/fonts")));

/** Autoloading routes */
app.set("views", path.join(process.env.PWD, "views"));
app.set("view engine", "pug");


app.locals = autoLocals();
app.use(autoRoute());
// create a database connector
app.set("connector", mysqlConnector());

/** Error handling */
app.use(errorHandler);

export default app;
