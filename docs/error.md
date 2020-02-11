## Functions

<dl>
<dt><a href="#handle404">handle404(req, res, next)</a></dt>
<dd><p>handle404 - catch 404 and forward to error handler</p>
</dd>
<dt><a href="#errorHandler">errorHandler(err, req, res)</a></dt>
<dd><p>errorHandler - The actual handler
provides a message the error to error.pug</p>
</dd>
</dl>

<a name="handle404"></a>

## handle404(req, res, next)
handle404 - catch 404 and forward to error handler

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Express~Request</code> | the HTTP request |
| res | <code>Express~Response</code> | the HTTP response |
| next | <code>Express~callback</code> | the next handler to call |

<a name="errorHandler"></a>

## errorHandler(err, req, res)
errorHandler - The actual handler
provides a message the error to error.pug

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>type</code> | the error |
| req | <code>Express~Request</code> | the HTTP request |
| res | <code>Express~Response</code> | the HTTP response |
