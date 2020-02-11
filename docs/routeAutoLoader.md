## Constants

<dl>
<dt><a href="#fs">fs</a></dt>
<dd><p>this file automatically set the route from the routes folder</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#loadFiles">loadFiles(app, [directory])</a> ⇒ <code>Express~Application</code></dt>
<dd><p>loadFiles - load the routes from the routes folder, only consider .js files, skip files that start by a _</p>
</dd>
</dl>

<a name="fs"></a>

## fs
this file automatically set the route from the routes folder

**Kind**: global constant  
**Author**: dhmmasson  
<a name="loadFiles"></a>

## loadFiles(app, [directory]) ⇒ <code>Express~Application</code>
loadFiles - load the routes from the routes folder, only consider .js files, skip files that start by a _

**Kind**: global function  
**Returns**: <code>Express~Application</code> - the Express application configured  
**Todo:**: be somehow recursive  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Express~Application</code> | the Express application to configure |
| [directory] | <code>string</code> | the path to extract the routes from |

