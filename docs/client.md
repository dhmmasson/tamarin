## Modules

<dl>
<dt><a href="#module_Models">Models</a></dt>
<dd><p>Contains all the different Models needed for the sorting algorithm</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#EventEmitter">EventEmitter</a></dt>
<dd></dd>
<dt><a href="#Sorter">Sorter</a> ⇐ <code><a href="#EventEmitter">EventEmitter</a></code></dt>
<dd><p>Sorter - the sortingAlgorithm wrapper class</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#definePrivateProperties">definePrivateProperties(object)</a> ⇒ <code>object</code></dt>
<dd><p>definePrivateProperties - automatically define private <strong>(non enumerable)</strong> properties</p>
</dd>
</dl>

<a name="module_Models"></a>

## Models
Contains all the different Models needed for the sorting algorithm

**Author**: dhmmasson <@dhmmasson>  

* [Models](#module_Models)
    * _static_
        * [.Evaluation](#module_Models.Evaluation)
    * _inner_
        * [~Criterion](#module_Models.Criterion) ⇐ [<code>EventEmitter</code>](#EventEmitter)
            * [new Criterion(serialization)](#new_module_Models.Criterion_new)
            * _instance_
                * [.weight](#module_Models.Criterion+weight) ⇒ <code>number</code>
                * [.weight](#module_Models.Criterion+weight) ⇒ <code>number</code>
                * [.blurIntensity](#module_Models.Criterion+blurIntensity) ⇒ <code>number</code>
                * [.blurIntensity](#module_Models.Criterion+blurIntensity) ⇒ <code>number</code>
                * [.blur(value)](#module_Models.Criterion+blur) ⇒ <code>Score</code>
                * [.fire(eventName)](#EventEmitter+fire)
                * [.on(eventName, callback, [_this])](#EventEmitter+on)
            * _static_
                * [.Criterion.eventType](#module_Models.Criterion.Criterion.eventType) : <code>enum</code>
        * [~Technology](#module_Models.Technology)
            * [new Technology(serialization)](#new_module_Models.Technology_new)
            * [.updateBounds(criteria)](#module_Models.Technology+updateBounds) ⇒ [<code>Technology</code>](#module_Models.Technology)
            * [.updateDominance(criteria, technologies)](#module_Models.Technology+updateDominance) ⇒ [<code>Technology</code>](#module_Models.Technology)
            * [.updateScore(criteria)](#module_Models.Technology+updateScore) ⇒ [<code>Technology</code>](#module_Models.Technology)

<a name="module_Models.Evaluation"></a>

### Models.Evaluation
**Kind**: static class of [<code>Models</code>](#module_Models)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| technology | <code>string</code> | Name of the technology |
| criteria | <code>string</code> | name of the criteria |
| value | <code>Score</code> | evaluation for the couple `technology` - `criteria` |

<a name="module_Models.Criterion"></a>

### Models~Criterion ⇐ [<code>EventEmitter</code>](#EventEmitter)
**Kind**: inner class of [<code>Models</code>](#module_Models)  
**Extends**: [<code>EventEmitter</code>](#EventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Unique name of the criteria, to use to reference the criteria |
| description | <code>string</code> | Full name to be used to be displayed |
| min | <code>Score</code> | Minimum value for the criteria in the database |
| max | <code>Score</code> | Maximum value for the criteria in the database |
| weight | <code>number</code> | weight of the criteria for the score computation |
| blurIntensity | <code>number</code> | [0-1] how much to extend the range [ evaluation - blurIntensity * ( max - min ), evaluation ] |


* [~Criterion](#module_Models.Criterion) ⇐ [<code>EventEmitter</code>](#EventEmitter)
    * [new Criterion(serialization)](#new_module_Models.Criterion_new)
    * _instance_
        * [.weight](#module_Models.Criterion+weight) ⇒ <code>number</code>
        * [.weight](#module_Models.Criterion+weight) ⇒ <code>number</code>
        * [.blurIntensity](#module_Models.Criterion+blurIntensity) ⇒ <code>number</code>
        * [.blurIntensity](#module_Models.Criterion+blurIntensity) ⇒ <code>number</code>
        * [.blur(value)](#module_Models.Criterion+blur) ⇒ <code>Score</code>
        * [.fire(eventName)](#EventEmitter+fire)
        * [.on(eventName, callback, [_this])](#EventEmitter+on)
    * _static_
        * [.Criterion.eventType](#module_Models.Criterion.Criterion.eventType) : <code>enum</code>

<a name="new_module_Models.Criterion_new"></a>

#### new Criterion(serialization)
constructor - create a new criterion from a serialization of it (either from json or from the db)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| serialization | <code>Object</code> |  |  |
| serialization.name | <code>string</code> |  | name of the criteria |
| [serialization.description] | <code>string</code> | <code>&quot;serialization.name&quot;</code> | description of the criteria, name if absent |
| [serialization.min] | <code>number</code> | <code>0</code> | min value for the criteria, 0 if absent |
| [serialization.max] | <code>number</code> | <code>5</code> | max value for the criteria, 5 if absent |

<a name="module_Models.Criterion+weight"></a>

#### criterion.weight ⇒ <code>number</code>
set - Change the weight of this criteria in the final mix

fire the event event:Criterion.eventType.weightUpdated followed by event event:Criterion.eventType.updated

**Kind**: instance property of [<code>Criterion</code>](#module_Models.Criterion)  
**Returns**: <code>number</code> - return the new weight  

| Param | Type | Description |
| --- | --- | --- |
| newWeight | <code>number</code> | the new weight. 0 indicate that the criteria is not considered in the final mix. There is no normalisation for now. |

<a name="module_Models.Criterion+weight"></a>

#### criterion.weight ⇒ <code>number</code>
get - get the weight associated to this criteria.

**Kind**: instance property of [<code>Criterion</code>](#module_Models.Criterion)  
**Returns**: <code>number</code> - the weight. 0 means that the criteria should not be considered  
<a name="module_Models.Criterion+blurIntensity"></a>

#### criterion.blurIntensity ⇒ <code>number</code>
set - fire the event event:Criterion.eventType.blurIntensityUpdated followed by event event:Criterion.eventType.updated

**Kind**: instance property of [<code>Criterion</code>](#module_Models.Criterion)  
**Returns**: <code>number</code> - return the intensity  

| Param | Type | Description |
| --- | --- | --- |
| intensity | <code>number</code> | a 0-1 value. 0 mean no blurring should be applied ( exact values ) 1 mean all values for this technology are the same. .5 means that A dominate B if B value is smaller than A - .5 * ( range ) |

<a name="module_Models.Criterion+blurIntensity"></a>

#### criterion.blurIntensity ⇒ <code>number</code>
get - return the intensity of the blur

**Kind**: instance property of [<code>Criterion</code>](#module_Models.Criterion)  
**Returns**: <code>number</code> - a value between 0 and 1.  
<a name="module_Models.Criterion+blur"></a>

#### criterion.blur(value) ⇒ <code>Score</code>
blur - take a evaluation and blur it according to the intensity

**Kind**: instance method of [<code>Criterion</code>](#module_Models.Criterion)  
**Returns**: <code>Score</code> - the computed lower bound  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>module:Models.Score</code> | the evaluation to blur |

<a name="EventEmitter+fire"></a>

#### criterion.fire(eventName)
fire - call the callback relative to the event

**Kind**: instance method of [<code>Criterion</code>](#module_Models.Criterion)  
**Overrides**: [<code>fire</code>](#EventEmitter+fire)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | name of the event to fire |

<a name="EventEmitter+on"></a>

#### criterion.on(eventName, callback, [_this])
on - add event listener

**Kind**: instance method of [<code>Criterion</code>](#module_Models.Criterion)  
**Overrides**: [<code>on</code>](#EventEmitter+on)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | event to subscribe to |
| callback | <code>EventEmitter.callback</code> | callback |
| [_this] | <code>object</code> | object to bind the callback TODO check for duplicate |

<a name="module_Models.Criterion.Criterion.eventType"></a>

#### Criterion.Criterion.eventType : <code>enum</code>
Criterion.eventType

**Kind**: static enum of [<code>Criterion</code>](#module_Models.Criterion)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| updated | <code>string</code> | <code>&quot;updated&quot;</code> | called when the criteria is changed |
| blurIntensityUpdated | <code>string</code> | <code>&quot;blurIntensityUpdated&quot;</code> | called when the blurIntensity is changed |
| weightUpdated | <code>string</code> | <code>&quot;weightUpdated&quot;</code> | called when the weightUpdated is changed |

<a name="module_Models.Technology"></a>

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
| dominance | <code>Object.&lt;Technology~name, number&gt;</code> | How many technologies are dominated ( value  >  bounds ) |
| score | <code>number</code> | computed score : weighted sum. |


* [~Technology](#module_Models.Technology)
    * [new Technology(serialization)](#new_module_Models.Technology_new)
    * [.updateBounds(criteria)](#module_Models.Technology+updateBounds) ⇒ [<code>Technology</code>](#module_Models.Technology)
    * [.updateDominance(criteria, technologies)](#module_Models.Technology+updateDominance) ⇒ [<code>Technology</code>](#module_Models.Technology)
    * [.updateScore(criteria)](#module_Models.Technology+updateScore) ⇒ [<code>Technology</code>](#module_Models.Technology)

<a name="new_module_Models.Technology_new"></a>

#### new Technology(serialization)
constructor - construct a new Technology object from a serialization (json or the db)


| Param | Type | Description |
| --- | --- | --- |
| serialization | <code>Object</code> |  |
| [serialization.technology] | <code>string</code> | name of the technology or `serialization.name` if not present |
| [serialization.name] | <code>string</code> | name of the technology |
| [serialization.description] | <code>string</code> | description of the technology |
| serialization.evaluations | <code>Object.&lt;string, module:Models.Score&gt;</code> | key are part [Criterion](#module_Models.Criterion) evaluations |

<a name="module_Models.Technology+updateBounds"></a>

#### technology.updateBounds(criteria) ⇒ [<code>Technology</code>](#module_Models.Technology)
updateBounds - update the bounds for the given criteria

**Kind**: instance method of [<code>Technology</code>](#module_Models.Technology)  
**Returns**: [<code>Technology</code>](#module_Models.Technology) - return this  

| Param | Type |
| --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | 

<a name="module_Models.Technology+updateDominance"></a>

#### technology.updateDominance(criteria, technologies) ⇒ [<code>Technology</code>](#module_Models.Technology)
updateDominance - compute how many other technology are dominated (i.e this lower bound is greater than their evaluation)

**Kind**: instance method of [<code>Technology</code>](#module_Models.Technology)  
**Returns**: [<code>Technology</code>](#module_Models.Technology) - this  

| Param | Type | Description |
| --- | --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | updated criteria ( or all ) |
| technologies | [<code>Array.&lt;Technology&gt;</code>](#module_Models.Technology) | all technologies to compare to |

<a name="module_Models.Technology+updateScore"></a>

#### technology.updateScore(criteria) ⇒ [<code>Technology</code>](#module_Models.Technology)
updateScore - weight sum of the dominance

**Kind**: instance method of [<code>Technology</code>](#module_Models.Technology)  
**Returns**: [<code>Technology</code>](#module_Models.Technology) - this  
**Todo**

- [ ] should normalize dominance to rank


| Param | Type | Description |
| --- | --- | --- |
| criteria | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | Array of all criteria |

<a name="EventEmitter"></a>

## EventEmitter
**Kind**: global class  

* [EventEmitter](#EventEmitter)
    * [new EventEmitter([eventType])](#new_EventEmitter_new)
    * _instance_
        * [.fire(eventName)](#EventEmitter+fire)
        * [.on(eventName, callback, [_this])](#EventEmitter+on)
    * _static_
        * [.eventType](#EventEmitter.eventType) : <code>enum</code>

<a name="new_EventEmitter_new"></a>

### new EventEmitter([eventType])
Constructor - Create an new event firer


| Param | Type | Description |
| --- | --- | --- |
| [eventType] | <code>Array.&lt;string&gt;</code> | list of possible events, serve no purpose for now |

<a name="EventEmitter+fire"></a>

### eventEmitter.fire(eventName)
fire - call the callback relative to the event

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | name of the event to fire |

<a name="EventEmitter+on"></a>

### eventEmitter.on(eventName, callback, [_this])
on - add event listener

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | event to subscribe to |
| callback | <code>EventEmitter.callback</code> | callback |
| [_this] | <code>object</code> | object to bind the callback TODO check for duplicate |

<a name="EventEmitter.eventType"></a>

### EventEmitter.eventType : <code>enum</code>
list of possible event that an eventFirer can fire

**Kind**: static enum of [<code>EventEmitter</code>](#EventEmitter)  
**Read only**: true  
<a name="Sorter"></a>

## Sorter ⇐ [<code>EventEmitter</code>](#EventEmitter)
Sorter - the sortingAlgorithm wrapper class

**Kind**: global class  
**Extends**: [<code>EventEmitter</code>](#EventEmitter)  

* [Sorter](#Sorter) ⇐ [<code>EventEmitter</code>](#EventEmitter)
    * [new Sorter([technologies], [criteria])](#new_Sorter_new)
    * _instance_
        * [.technologies](#Sorter+technologies)
        * [.criteria](#Sorter+criteria)
        * [.technologies](#Sorter+technologies)
        * [.technologies](#Sorter+technologies) ⇒ <code>type</code>
        * [.criteria](#Sorter+criteria)
        * [.criteria](#Sorter+criteria) ⇒ <code>type</code>
        * [.sort()](#Sorter+sort) ⇒ [<code>Sorter</code>](#Sorter)
        * [.updateDominance()](#Sorter+updateDominance) ⇒ [<code>Sorter</code>](#Sorter)
        * [.updateBounds()](#Sorter+updateBounds) ⇒ [<code>Sorter</code>](#Sorter)
        * [.updateScore()](#Sorter+updateScore) ⇒ [<code>Sorter</code>](#Sorter)
        * [.fire(eventName)](#EventEmitter+fire)
        * [.on(eventName, callback, [_this])](#EventEmitter+on)
    * _static_
        * [.eventType](#Sorter.eventType) : <code>enum</code>

<a name="new_Sorter_new"></a>

### new Sorter([technologies], [criteria])
constructor - initialize everything


| Param | Type | Description |
| --- | --- | --- |
| [technologies] | [<code>Array.&lt;Technology&gt;</code>](#module_Models.Technology) | description |
| [criteria] | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | description |

<a name="Sorter+technologies"></a>

### sorter.technologies
**Kind**: instance property of [<code>Sorter</code>](#Sorter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| technologies | <code>Object</code> | all the technologies |
| technologies.all | [<code>Array.&lt;Technology&gt;</code>](#module_Models.Technology) | Array of all the technologies |
| technologies.sorted | <code>Object</code> | Array of all the technologies sorted by latest computed score |
| technologies.map | <code>Object</code> | ap of all the technologies to be sorted, call the setter |

<a name="Sorter+criteria"></a>

### sorter.criteria
**Kind**: instance property of [<code>Sorter</code>](#Sorter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| criteria | <code>Object</code> | all the criteria |
| criteria.all | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | Array of all the criteria |
| criteria.updated | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | Array of all the criteria that have been recently updated |
| criteria.map | <code>Object.&lt;string, Array.&lt;module:Models.Criterion&gt;&gt;</code> | Array of all the criteria that have been recently updated |

<a name="Sorter+technologies"></a>

### sorter.technologies
set technologies - initialize the technology map, reset the sorted arrays

**Kind**: instance property of [<code>Sorter</code>](#Sorter)  

| Param | Type | Description |
| --- | --- | --- |
| technologies | [<code>Array.&lt;Technology&gt;</code>](#module_Models.Technology) | json serialized technology array |

<a name="Sorter+technologies"></a>

### sorter.technologies ⇒ <code>type</code>
get technologies - return the object _technologies

**Kind**: instance property of [<code>Sorter</code>](#Sorter)  
**Returns**: <code>type</code> - description  
<a name="Sorter+criteria"></a>

### sorter.criteria
set criteria - initialize the criteria map, reset the values

**Kind**: instance property of [<code>Sorter</code>](#Sorter)  

| Param | Type | Description |
| --- | --- | --- |
| Criterion | [<code>Array.&lt;Criterion&gt;</code>](#module_Models.Criterion) | description |

<a name="Sorter+criteria"></a>

### sorter.criteria ⇒ <code>type</code>
get criteria - description

**Kind**: instance property of [<code>Sorter</code>](#Sorter)  
**Returns**: <code>type</code> - description  
<a name="Sorter+sort"></a>

### sorter.sort() ⇒ [<code>Sorter</code>](#Sorter)
sort - sort all technologies. UpdateBounds > UpdateDominance > UpdateScore then sort.
Clear updatedCriteria.
fire event:Sorter.eventType.sorted

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Returns**: [<code>Sorter</code>](#Sorter) - this  
<a name="Sorter+updateDominance"></a>

### sorter.updateDominance() ⇒ [<code>Sorter</code>](#Sorter)
updateDominance - refresh all dominance

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Returns**: [<code>Sorter</code>](#Sorter) - this  
<a name="Sorter+updateBounds"></a>

### sorter.updateBounds() ⇒ [<code>Sorter</code>](#Sorter)
updateBounds - refresh technology bounds for the updated criteria

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Returns**: [<code>Sorter</code>](#Sorter) - this sorter  
<a name="Sorter+updateScore"></a>

### sorter.updateScore() ⇒ [<code>Sorter</code>](#Sorter)
updateScore - refresh the score of all technologies

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Returns**: [<code>Sorter</code>](#Sorter) - this  
<a name="EventEmitter+fire"></a>

### sorter.fire(eventName)
fire - call the callback relative to the event

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Overrides**: [<code>fire</code>](#EventEmitter+fire)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | name of the event to fire |

<a name="EventEmitter+on"></a>

### sorter.on(eventName, callback, [_this])
on - add event listener

**Kind**: instance method of [<code>Sorter</code>](#Sorter)  
**Overrides**: [<code>on</code>](#EventEmitter+on)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>eventType</code>](#EventEmitter.eventType) | event to subscribe to |
| callback | <code>EventEmitter.callback</code> | callback |
| [_this] | <code>object</code> | object to bind the callback TODO check for duplicate |

<a name="Sorter.eventType"></a>

### Sorter.eventType : <code>enum</code>
Sorter.eventType

**Kind**: static enum of [<code>Sorter</code>](#Sorter)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| sorted | <code>string</code> | <code>&quot;sorted&quot;</code> | 

<a name="definePrivateProperties"></a>

## definePrivateProperties(object) ⇒ <code>object</code>
definePrivateProperties - automatically define private **(non enumerable)** properties

**Kind**: global function  
**Returns**: <code>object</code> - the `object`  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | the object for which you want to define private properties |
| ...names | <code>string</code> | as many private fields as you want to define |

