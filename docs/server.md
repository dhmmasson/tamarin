## Modules

<dl>
<dt><a href="#module_ExpressUtils">ExpressUtils</a></dt>
<dd><p>Express Utilities</p>
</dd>
<dt><a href="#module_HttpUtils">HttpUtils</a></dt>
<dd><p>HTTP Utilities</p>
</dd>
<dt><a href="#module_Models">Models</a></dt>
<dd><p>Contains all the different Models needed for the sorting algorithm</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#exportTemplates">exportTemplates(pugPath, jsPath, [_templateName])</a></dt>
<dd><p>exportTemplates - Read the folder <code>path</code>, parse all pug files and create a <code>_templateName</code>.js file corresponding in the <code>jsPath</code></p>
</dd>
<dt><a href="#convertPugFile">convertPugFile(origin, files)</a> ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#convert">convert(origin, file)</a> ⇒ <code>promise.&lt;string&gt;</code></dt>
<dd><p>Convert template <code>file</code> to a function string</p>
</dd>
<dt><a href="#save">save(destination, templateName, jsFunctionArray)</a> ⇒ <code>promise</code></dt>
<dd><p>Save all template functions in <code>jsFunctionArray</code> in file <code>templateName</code>  in folder <code>destination</code>
all functions become method of an Object named <code>templateName</code>
a pug object containing all necessary pug runtime functions is also included</p>
</dd>
<dt><a href="#functionToMethod">functionToMethod(_str, prefix, objectName)</a> ⇒ <code>string</code></dt>
<dd><p>transform all functions that start with the given <code>prefix</code> in the input <code>str</code> to method of the object <code>objectName</code></p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Query">Query</a> : <code>string</code></dt>
<dd><p>a string representing a mysql Query</p>
</dd>
</dl>

<a name="module_ExpressUtils"></a>

## ExpressUtils
Express Utilities

**Author**: dhmmasson  

* [ExpressUtils](#module_ExpressUtils)
    * _static_
        * [.setLocals(app)](#module_ExpressUtils.setLocals) ⇒ <code>Express~Application</code>
        * [.loadFiles(app, [directory])](#module_ExpressUtils.loadFiles) ⇒ <code>Express~Application</code>
    * _inner_
        * [~Connector](#module_ExpressUtils.Connector)
            * [new Connector(_configuration)](#new_module_ExpressUtils.Connector_new)
            * [.sqlRoot](#module_ExpressUtils.Connector+sqlRoot)
            * [.pool](#module_ExpressUtils.Connector+pool)
            * [.sql](#module_ExpressUtils.Connector+sql)
            * [.importSql()](#module_ExpressUtils.Connector+importSql) ⇒ <code>Promise.&lt;empty&gt;</code>
            * [.getCriteria()](#module_ExpressUtils.Connector+getCriteria) ⇒ <code>Promise.&lt;Array.&lt;Criterion&gt;&gt;</code>
            * [.getTechnologies()](#module_ExpressUtils.Connector+getTechnologies) ⇒ <code>Promise.&lt;Array.&lt;Technology&gt;&gt;</code>

<a name="module_ExpressUtils.setLocals"></a>

### ExpressUtils.setLocals(app) ⇒ <code>Express~Application</code>
setLocals - set the pug locals

**Kind**: static method of [<code>ExpressUtils</code>](#module_ExpressUtils)  
**Returns**: <code>Express~Application</code> - the Express application configured  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Express~Application</code> | the Express application to configure |

<a name="module_ExpressUtils.loadFiles"></a>

### ExpressUtils.loadFiles(app, [directory]) ⇒ <code>Express~Application</code>
loadFiles - load the routes from the routes folder, only consider .js files, skip files that start by a _

**Kind**: static method of [<code>ExpressUtils</code>](#module_ExpressUtils)  
**Returns**: <code>Express~Application</code> - the Express application configured  
**Todo:**: Use express-autoroute  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Express~Application</code> | the Express application to configure |
| [directory] | <code>string</code> | the path to extract the routes from |

<a name="module_ExpressUtils.Connector"></a>

### ExpressUtils~Connector
Connector to the database, read queries from sql files

**Kind**: inner class of [<code>ExpressUtils</code>](#module_ExpressUtils)  

* [~Connector](#module_ExpressUtils.Connector)
    * [new Connector(_configuration)](#new_module_ExpressUtils.Connector_new)
    * [.sqlRoot](#module_ExpressUtils.Connector+sqlRoot)
    * [.pool](#module_ExpressUtils.Connector+pool)
    * [.sql](#module_ExpressUtils.Connector+sql)
    * [.importSql()](#module_ExpressUtils.Connector+importSql) ⇒ <code>Promise.&lt;empty&gt;</code>
    * [.getCriteria()](#module_ExpressUtils.Connector+getCriteria) ⇒ <code>Promise.&lt;Array.&lt;Criterion&gt;&gt;</code>
    * [.getTechnologies()](#module_ExpressUtils.Connector+getTechnologies) ⇒ <code>Promise.&lt;Array.&lt;Technology&gt;&gt;</code>

<a name="new_module_ExpressUtils.Connector_new"></a>

#### new Connector(_configuration)
constructor - create a databaseConnector to get informations

**Returns**: [<code>Connector</code>](#module_ExpressUtils.Connector) - description  

| Param | Type | Description |
| --- | --- | --- |
| _configuration | <code>Object</code> | Accept all mysql2 options + a path for the sql queries folder, the following are set by default. |
| _configuration.host | <code>Object</code> | Set by default to the env variable     mysqlHost |
| _configuration.user | <code>Object</code> | Set by default to the env variable     mysqlUser |
| _configuration.password | <code>Object</code> | Set by default to the env variable mysqlPassword |
| _configuration.database | <code>Object</code> | Set by default to the env variable mysqlDatabase |
| _configuration.sqlPath | <code>Object</code> | Path to the sql folder containing the request. |

<a name="module_ExpressUtils.Connector+sqlRoot"></a>

#### connector.sqlRoot
**Kind**: instance property of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sqlRoot | <code>Object.&lt;string, Query&gt;</code> | root folder for the sql files |

<a name="module_ExpressUtils.Connector+pool"></a>

#### connector.pool
**Kind**: instance property of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pool | <code>external:MySql2.pool</code> | internal pool to query the db |

<a name="module_ExpressUtils.Connector+sql"></a>

#### connector.sql
**Kind**: instance property of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sql | <code>Object.&lt;string, Query&gt;</code> | queries map |

<a name="module_ExpressUtils.Connector+importSql"></a>

#### connector.importSql() ⇒ <code>Promise.&lt;empty&gt;</code>
importSql - Read the files in the this.sqlRoot folder, populate this.sql with

**Kind**: instance method of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Returns**: <code>Promise.&lt;empty&gt;</code> - An empty promise... resolved when the sql map is filled  
<a name="module_ExpressUtils.Connector+getCriteria"></a>

#### connector.getCriteria() ⇒ <code>Promise.&lt;Array.&lt;Criterion&gt;&gt;</code>
Connector#getCriteria -  return all the criteria in the database

**Kind**: instance method of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Returns**: <code>Promise.&lt;Array.&lt;Criterion&gt;&gt;</code> - Promise to deliver all the [Criterion](#module_Models..Criterion) from the database  
<a name="module_ExpressUtils.Connector+getTechnologies"></a>

#### connector.getTechnologies() ⇒ <code>Promise.&lt;Array.&lt;Technology&gt;&gt;</code>
Connector:getTechnologies - return all evaluated technologies

**Kind**: instance method of [<code>Connector</code>](#module_ExpressUtils.Connector)  
**Returns**: <code>Promise.&lt;Array.&lt;Technology&gt;&gt;</code> - Promise to deliver the evaluated [Technology](#module_Models..Technology) from the database  
**Todo**

- [ ] join with technology table to gather the description

<a name="module_HttpUtils"></a>

## HttpUtils
HTTP Utilities

**Author**: dhmmasson <@dhmmasson>  

* [HttpUtils](#module_HttpUtils)
    * [.errorHandler(port)](#module_HttpUtils.errorHandler) ⇒ <code>module:ExpressUtility.onError</code>
    * [.listeningHandler()](#module_HttpUtils.listeningHandler) ⇒ <code>module:ExpressUtility.onListening</code>
    * [.normalizePort(value)](#module_HttpUtils.normalizePort) ⇒ <code>string</code> \| <code>number</code> \| <code>false</code>
    * [..onError](#module_HttpUtils.onError) : <code>function</code>
    * [..onListening](#module_HttpUtils.onListening) : <code>function</code>

<a name="module_HttpUtils.errorHandler"></a>

### HttpUtils.errorHandler(port) ⇒ <code>module:ExpressUtility.onError</code>
generate an event listener capable of printing the port

**Kind**: static method of [<code>HttpUtils</code>](#module_HttpUtils)  
**Returns**: <code>module:ExpressUtility.onError</code> - Event listener for HTTP server "error" event.  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>string</code> \| <code>number</code> | name of the pipe or port number |

<a name="module_HttpUtils.listeningHandler"></a>

### HttpUtils.listeningHandler() ⇒ <code>module:ExpressUtility.onListening</code>
listeningHandler - return an Event listener for HTTP server "listening" event.

**Kind**: static method of [<code>HttpUtils</code>](#module_HttpUtils)  
**Returns**: <code>module:ExpressUtility.onListening</code> - an onlistening calback that print the port number or pipe name  

| Param | Description |
| --- | --- |
| {@external:Express.Server} | server an express server associated with the listening |

<a name="module_HttpUtils.normalizePort"></a>

### HttpUtils.normalizePort(value) ⇒ <code>string</code> \| <code>number</code> \| <code>false</code>
normalizePort - Normalize a port into a number, string, or false.

**Kind**: static method of [<code>HttpUtils</code>](#module_HttpUtils)  
**Returns**: <code>string</code> \| <code>number</code> \| <code>false</code> - the name of the pipe or the port number or false  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> | either pipe name or port number |

<a name="module_HttpUtils.onError"></a>

### HttpUtils..onError : <code>function</code>
Express Error Callback

**Kind**: static typedef of [<code>HttpUtils</code>](#module_HttpUtils)  
**Throws**:

- <code>EACCES</code><code>EADDRINUSE</code> 


| Param | Type |
| --- | --- |
| error | <code>external:Express.Error</code> | 

<a name="module_HttpUtils.onListening"></a>

### HttpUtils..onListening : <code>function</code>
listening Callback

**Kind**: static typedef of [<code>HttpUtils</code>](#module_HttpUtils)  
<a name="module_Models"></a>

## Models
Contains all the different Models needed for the sorting algorithm

**Author**: dhmmasson <@dhmmasson>  

* [Models](#module_Models)
    * [~Criterion](#module_Models..Criterion) ⇐ <code>EventEmitter</code>
        * [new Criterion(serialization)](#new_module_Models..Criterion_new)
        * _instance_
            * [.weight](#module_Models..Criterion+weight) ⇒ <code>number</code>
            * [.weight](#module_Models..Criterion+weight) ⇒ <code>number</code>
            * [.blurIntensity](#module_Models..Criterion+blurIntensity) ⇒ <code>number</code>
            * [.blurIntensity](#module_Models..Criterion+blurIntensity) ⇒ <code>number</code>
            * [.blur(value)](#module_Models..Criterion+blur) ⇒ <code>Score</code>
        * _static_
            * [.Criterion.eventType](#module_Models..Criterion.Criterion.eventType) : <code>enum</code>
    * [~Technology](#module_Models..Technology)
        * [new Technology(serialization)](#new_module_Models..Technology_new)
        * [.updateBounds(criteria)](#module_Models..Technology+updateBounds) ⇒ [<code>Technology</code>](#module_Models..Technology)
        * [.updateDominance(criteria, technologies)](#module_Models..Technology+updateDominance) ⇒ [<code>Technology</code>](#module_Models..Technology)
        * [.updateScore(criteria)](#module_Models..Technology+updateScore) ⇒ [<code>Technology</code>](#module_Models..Technology)
    * [~Evaluation](#module_Models..Evaluation)
    * [~Score](#module_Models..Score) : <code>number</code>

<a name="module_Models..Criterion"></a>

### Models~Criterion ⇐ <code>EventEmitter</code>
**Kind**: inner class of [<code>Models</code>](#module_Models)  
**Extends**: <code>EventEmitter</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Unique name of the criteria, to use to reference the criteria |
| description | <code>string</code> | Full name to be used to be displayed |
| min | <code>Score</code> | Minimum value for the criteria in the database |
| max | <code>Score</code> | Maximum value for the criteria in the database |
| weight | <code>number</code> | weight of the criteria for the score computation |
| blurIntensity | <code>number</code> | [0-1] how much to extend the range [ evaluation - blurIntensity * ( max - min ), evaluation ] |


* [~Criterion](#module_Models..Criterion) ⇐ <code>EventEmitter</code>
    * [new Criterion(serialization)](#new_module_Models..Criterion_new)
    * _instance_
        * [.weight](#module_Models..Criterion+weight) ⇒ <code>number</code>
        * [.weight](#module_Models..Criterion+weight) ⇒ <code>number</code>
        * [.blurIntensity](#module_Models..Criterion+blurIntensity) ⇒ <code>number</code>
        * [.blurIntensity](#module_Models..Criterion+blurIntensity) ⇒ <code>number</code>
        * [.blur(value)](#module_Models..Criterion+blur) ⇒ <code>Score</code>
    * _static_
        * [.Criterion.eventType](#module_Models..Criterion.Criterion.eventType) : <code>enum</code>

<a name="new_module_Models..Criterion_new"></a>

#### new Criterion(serialization)
constructor - create a new criterion from a serialization of it (either from json or from the db)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| serialization | <code>Object</code> |  |  |
| serialization.name | <code>string</code> |  | name of the criteria |
| [serialization.description] | <code>string</code> | <code>&quot;serialization.name&quot;</code> | description of the criteria, name if absent |
| [serialization.min] | <code>number</code> | <code>0</code> | min value for the criteria, 0 if absent |
| [serialization.max] | <code>number</code> | <code>5</code> | max value for the criteria, 5 if absent |

<a name="module_Models..Criterion+weight"></a>

#### criterion.weight ⇒ <code>number</code>
set - Change the weight of this criteria in the final mix

fire the event event:Criterion.eventType.weightUpdated followed by event event:Criterion.eventType.updated

**Kind**: instance property of [<code>Criterion</code>](#module_Models..Criterion)  
**Returns**: <code>number</code> - return the new weight  

| Param | Type | Description |
| --- | --- | --- |
| newWeight | <code>number</code> | the new weight. 0 indicate that the criteria is not considered in the final mix. There is no normalisation for now. |

<a name="module_Models..Criterion+weight"></a>

#### criterion.weight ⇒ <code>number</code>
get - get the weight associated to this criteria.

**Kind**: instance property of [<code>Criterion</code>](#module_Models..Criterion)  
**Returns**: <code>number</code> - the weight. 0 means that the criteria should not be considered  
<a name="module_Models..Criterion+blurIntensity"></a>

#### criterion.blurIntensity ⇒ <code>number</code>
set - fire the event event:Criterion.eventType.blurIntensityUpdated followed by event event:Criterion.eventType.updated

**Kind**: instance property of [<code>Criterion</code>](#module_Models..Criterion)  
**Returns**: <code>number</code> - return the intensity  

| Param | Type | Description |
| --- | --- | --- |
| intensity | <code>number</code> | a 0-1 value. 0 mean no blurring should be applied ( exact values ) 1 mean all values for this technology are the same. .5 means that A dominate B if B value is smaller than A - .5 * ( range ) |

<a name="module_Models..Criterion+blurIntensity"></a>

#### criterion.blurIntensity ⇒ <code>number</code>
get - return the intensity of the blur

**Kind**: instance property of [<code>Criterion</code>](#module_Models..Criterion)  
**Returns**: <code>number</code> - a value between 0 and 1.  
<a name="module_Models..Criterion+blur"></a>

#### criterion.blur(value) ⇒ <code>Score</code>
blur - take a evaluation and blur it according to the intensity

**Kind**: instance method of [<code>Criterion</code>](#module_Models..Criterion)  
**Returns**: <code>Score</code> - the computed lower bound  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>Score</code>](#module_Models..Score) | the evaluation to blur |

<a name="module_Models..Criterion.Criterion.eventType"></a>

#### Criterion.Criterion.eventType : <code>enum</code>
Criterion.eventType

**Kind**: static enum of [<code>Criterion</code>](#module_Models..Criterion)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| updated | <code>string</code> | <code>&quot;updated&quot;</code> | called when the criteria is changed |
| blurIntensityUpdated | <code>string</code> | <code>&quot;blurIntensityUpdated&quot;</code> | called when the blurIntensity is changed |
| weightUpdated | <code>string</code> | <code>&quot;weightUpdated&quot;</code> | called when the weightUpdated is changed |

<a name="module_Models..Technology"></a>

### Models~Technology
**Kind**: inner class of [<code>Models</code>](#module_Models)  
**Todo**

- [ ] Change everything to have a it in a one read ( compare this techno to an reduced array of technologies )

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Unique name of the technology, to use to reference the criteria |
| description | <code>string</code> | Full name to be used to be displayed |
| evaluations | <code>Object.&lt;Criterion~name, Evaluation~value&gt;</code> | actual evaluation of the technology for the criteria |
| bounds | <code>Object.&lt;Criterion~name, Evaluation~value&gt;</code> | blurred value for the criteria |
| dominance | <code>Object.&lt;Criterion~name, number&gt;</code> | How many technologies are dominated ( value  >  bounds ) |
| score | <code>number</code> | computed score : weighted sum. |


* [~Technology](#module_Models..Technology)
    * [new Technology(serialization)](#new_module_Models..Technology_new)
    * [.updateBounds(criteria)](#module_Models..Technology+updateBounds) ⇒ [<code>Technology</code>](#module_Models..Technology)
    * [.updateDominance(criteria, technologies)](#module_Models..Technology+updateDominance) ⇒ [<code>Technology</code>](#module_Models..Technology)
    * [.updateScore(criteria)](#module_Models..Technology+updateScore) ⇒ [<code>Technology</code>](#module_Models..Technology)

<a name="new_module_Models..Technology_new"></a>

#### new Technology(serialization)
constructor - construct a new Technology object from a serialization (json or the db)


| Param | Type | Description |
| --- | --- | --- |
| serialization | <code>Object</code> |  |
| [serialization.technology] | <code>string</code> | name of the technology or `serialization.name` if not present |
| [serialization.name] | <code>string</code> | name of the technology |
| [serialization.description] | <code>string</code> | description of the technology |
| serialization.evaluations | <code>Object.&lt;string, module:Models~Score&gt;</code> | key are part [Criterion](#module_Models..Criterion) evaluations |

<a name="module_Models..Technology+updateBounds"></a>

#### technology.updateBounds(criteria) ⇒ [<code>Technology</code>](#module_Models..Technology)
updateBounds - update the bounds for the given criteria

**Kind**: instance method of [<code>Technology</code>](#module_Models..Technology)  
**Returns**: [<code>Technology</code>](#module_Models..Technology) - return this  

| Param | Type |
| --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models..Criterion) | 

<a name="module_Models..Technology+updateDominance"></a>

#### technology.updateDominance(criteria, technologies) ⇒ [<code>Technology</code>](#module_Models..Technology)
updateDominance - compute how many other technology are dominated (i.e this lower bound is greater than their evaluation)

**Kind**: instance method of [<code>Technology</code>](#module_Models..Technology)  
**Returns**: [<code>Technology</code>](#module_Models..Technology) - this  

| Param | Type | Description |
| --- | --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models..Criterion) | updated criteria ( or all ) |
| technologies | [<code>Array.&lt;Technology&gt;</code>](#module_Models..Technology) | all technologies to compare to |

<a name="module_Models..Technology+updateScore"></a>

#### technology.updateScore(criteria) ⇒ [<code>Technology</code>](#module_Models..Technology)
updateScore - weight sum of the dominance

**Kind**: instance method of [<code>Technology</code>](#module_Models..Technology)  
**Returns**: [<code>Technology</code>](#module_Models..Technology) - this  
**Todo**

- [ ] should normalize dominance to rank


| Param | Type | Description |
| --- | --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models..Criterion) | Array of all criteria |

<a name="module_Models..Evaluation"></a>

### Models~Evaluation
**Kind**: inner class of [<code>Models</code>](#module_Models)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| technology | <code>string</code> | Name of the technology |
| criteria | <code>string</code> | name of the criteria |
| value | <code>Score</code> | evaluation for the couple `technology` - `criteria` |

<a name="module_Models..Score"></a>

### Models~Score : <code>number</code>
number between 0 - 5

**Kind**: inner typedef of [<code>Models</code>](#module_Models)  
<a name="exportTemplates"></a>

## exportTemplates(pugPath, jsPath, [_templateName])
exportTemplates - Read the folder `path`, parse all pug files and create a `_templateName`.js file corresponding in the `jsPath`

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pugPath | <code>string</code> |  | folder path containing the pug files to export |
| jsPath | <code>string</code> |  | folder path containing the pug files to export |
| [_templateName] | <code>string</code> | <code>&quot;template&quot;</code> | folder path containing the pug files to export |

<a name="convertPugFile"></a>

## convertPugFile(origin, files) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - a Promised array of function strings  

| Param | Type | Description |
| --- | --- | --- |
| origin | <code>string</code> | the path to the template folder |
| files | <code>Array.&lt;string&gt;</code> | an array of files to consider as template ( only *.pug file will be used ) |

<a name="convert"></a>

## convert(origin, file) ⇒ <code>promise.&lt;string&gt;</code>
Convert template `file` to a function string

**Kind**: global function  
**Returns**: <code>promise.&lt;string&gt;</code> - a resolved promise with the jsFunction string corresponding to the pug file  

| Param | Type | Description |
| --- | --- | --- |
| origin | <code>string</code> | path to the folder containing the pug templates |
| file | <code>string</code> | the pug template |

<a name="save"></a>

## save(destination, templateName, jsFunctionArray) ⇒ <code>promise</code>
Save all template functions in `jsFunctionArray` in file `templateName`  in folder `destination`
all functions become method of an Object named `templateName`
a pug object containing all necessary pug runtime functions is also included

**Kind**: global function  
**Returns**: <code>promise</code> - Promise from fs.writeFile  
**Todo**

- [ ] change handle just one function instead of array


| Param | Type | Description |
| --- | --- | --- |
| destination | <code>string</code> | where to save the script file containing the templates function |
| templateName | <code>string</code> | where to save the script file containing the templates function |
| jsFunctionArray | <code>Array.&lt;string&gt;</code> | an array of template function strings to be concatened and save tot he file |

<a name="functionToMethod"></a>

## functionToMethod(_str, prefix, objectName) ⇒ <code>string</code>
transform all functions that start with the given `prefix` in the input `str` to method of the object `objectName`

**Kind**: global function  
**Returns**: <code>string</code> - The modified string  

| Param | Type | Description |
| --- | --- | --- |
| _str | <code>string</code> | javascript text to convert. e.g. `pug_attr( a, e) { }` |
| prefix | <code>string</code> | prefix to all function to be converted e.g. pug_ |
| objectName | <code>string</code> | name of the target object to bear the methods e.g. pug |

<a name="Query"></a>

## Query : <code>string</code>
a string representing a mysql Query

**Kind**: global typedef  
