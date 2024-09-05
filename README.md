# Tamarin

[![SWH](https://archive.softwareheritage.org/badge/origin/https://github.com/dhmmasson/rezbuild-emperor-tamarin/)](https://archive.softwareheritage.org/browse/origin/?origin_url=https://github.com/dhmmasson/rezbuild-emperor-tamarin)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.13628740.svg)](https://doi.org/10.5281/zenodo.13628740)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Tamarin is an open-source **interactive alternative ranking system** for Multi-Criteria Decision-Making (MCDM) designed to help users select the optimal technology alternatives based on their preferences and criteria. The software integrates quantitative and qualitative data to rank alternatives, considering user-defined importance and uncertainty levels. Tamarin’s dynamic user interface allows real-time adjustments, enabling users to set for each criteria, importance, and granularity, and observe the impact on rankings. Built for flexibility, Tamarin supports various decision-making scenarios, including refurbishment technology selection, washing machine comparisons, or any decision involving evaluated alternatives provided through CSV files.

You can observe not only the ranking but also the impact of each parameter on the final ranking but on each individual criteria with the parallel plot visualisation: 

![Demonstration of the parallel plot](/docs/parallelPlotCoordinate.gif)

## Install

### Generate the static version 

For version 2.0 the idea is to generate a static version of the application that can be served by any web server. This mean rendering the pug into HTML, rendering the scss to css and bundling the app logic into a single js file. The "api" part is **statically generated**, (the JSON files are directly served as files). 
Version 2 will drop all the app logic, and will rely on the csv import for the orignal dataset.

To build the full project: 
```bash
npm run build 
``` 
you can build indivually the css, pug or js elements. 
```
  build-css
    sass public/stylesheets/style.scss docs/static/stylesheets/style.css --quiet
  build-pug
    npx pug3 -P views/index.pug --out docs/static/
  build-template
    node src/exportTemplate.cjs
  build-js
    npm run build-template && webpack --config webpack.config.cjs --mode=production
  build
    npm run build-css && npm run build-pug && npm run build-js 
```

### node version (DEPRECATED)

1. Create the database and populate the database
   1. Create an empty database on mysql
   2. Import db/structure\_\*.sql ( you may have to reorder the elements )
   3. import dataset db/_dataset_.sql
1. rename .env.exemple .env and modify .env file with database information (host, name, user, password)
1. install libraries : npm install
1. test by launching the app : npm start

#### quick dev

1. install nodemon : npm install nodemon
1. launch the app :

- nodemon ./bin/www.mjs
- Or a better version :
- nodemon -i public/javascripts -e js,pug,mjs,cjs bin/www.mjs


## Cite 

### Latest version 
```APA
Masson, D., Laguna Salvadó, L., & Villeneuve, E. (2024). Tamarin [Computer software]. https://https://doi.org/10.5281/zenodo.13628637
```

```bibtex
@software{Masson_Tamarin_2024,
   author = {Masson, Dimitri and Laguna Salvadó, Laura and Villeneuve, Eric},
   license = {MIT},
   month = sep,
   title = {{Tamarin}},
   url = {https://github.com/dhmmasson/tamarin},
   version = {v1.9},
   year = {2024}
   doi = {10.5281/zenodo.13628637}
}
```

### version v1.9
```APA
Masson, D., Laguna Salvadó, L., & Villeneuve, E. (2024). Tamarin (Version v1.9) [Computer software]. https://https://doi.org/10.5281/zenodo.13628740
```

```bibtex
@software{Masson_Tamarin_2024,
   author = {Masson, Dimitri and Laguna Salvadó, Laura and Villeneuve, Eric},
   license = {MIT},
   month = sep,
   title = {{Tamarin}},
   url = {https://github.com/dhmmasson/tamarin},
   version = {v1.9},
   year = {2024}
   doi = {10.5281/zenodo.13628740}
}
```