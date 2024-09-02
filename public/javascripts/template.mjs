let template={}, pug={};
pug.attr = function(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug.escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
pug.attrs = function(t,r){var a="";for(var s in t)if(pug_has_own_property.call(t,s)){var u=t[s];if("class"===s){u=pug.classes(u),a=pug.attr(s,u,!1,r)+a;continue}"style"===s&&(u=pug.style(u)),a+=pug_attr(s,u,!1,r)}return a}
pug.classes = function(s,r){return Array.isArray(s)?pug.classes_array(s,r):s&&"object"==typeof s?pug.classes_object(s):s||""}
pug.classes_array = function(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
pug.classes_object = function(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
pug.escape = function(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
pug.merge = function(e,r){if(1===arguments.length){for(var t=e[0],g=1;g<e.length;g++)t=pug.merge(t,e[g]);return t}for(var l in r)if("class"===l){var n=e[l]||[];e[l]=(Array.isArray(n)?n:[n]).concat(r[l]||[])}else if("style"===l){var n=pug_style(e[l]);n=n&&";"!==n[n.length-1]?n+";":n;var a=pug_style(r[l]);a=a&&";"!==a[a.length-1]?a+";":a,e[l]=n+a}else e[l]=r[l];return e}
pug.rethrow = function(e,n,r,t){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&n||t))throw e.message+=" on line "+r,e;var o,a,i,s;try{t=t||require("fs").readFileSync(n,{encoding:"utf8"}),o=3,a=t.split("\n"),i=Math.max(r-o,0),s=Math.min(a.length,r+o)}catch(t){return e.message+=" - could not read from "+n+" ("+t.message+")",void pug.rethrow(e,null,r)}o=a.slice(i,s).map(function(e,n){var t=n+i+1;return(t==r?"  > ":"    ")+t+"| "+e}).join("\n"),e.path=n;try{e.message=(n||"Pug")+":"+r+"\n"+o+"\n\n"+e.message}catch(e){}throw e}
pug.style = function(r){if(!r)return"";if("object"==typeof r){var t="";for(var e in r)pug_has_own_property.call(r,e)&&(t=t+e+":"+r[e]+";");return t}return r+""};
template.table = function(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;
    var locals_for_with = (locals || {});
    
    (function (Array, Math, Number, criteria, technologies) {
      function fixed2( x ) { return Number.parseFloat(x).toFixed(2)}
const names = ["star", "star_half", "star_border"];
function star( x ) {  x = Math.min(1, Math.max(0,x))||0 ; const full = Math.floor( x * 5 ), half = Math.floor( x * 10 ) %2 ; return [ full, half, 5 - full - half ].map( (e,i)=> Array( e ).fill( names[i] ) ).flat() } 
const sortedCriteria = criteria.filter((c) => c.weight > 0).sort((a, b) => a.weight - b.weight);
pug_html = pug_html + "\u003Ctable class=\"responsive-table striped compactTable\"\u003E\u003Cthead\u003E\u003Ctr class=\"hide-on-med-and-down\"\u003E\u003Cth\u003ETechnology\u003C\u002Fth\u003E\u003Cth\u003E\u003Cdiv class=\"flex\"\u003E\u003Cspan class=\"orange-text\"\u003Escore\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E";
// iterate sortedCriteria
;(function(){
  var $$obj = sortedCriteria;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var criterion = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth\u003E\u003Cdiv class=\"flex\"\u003E";
let style = `color:${criterion.color}`;
pug_html = pug_html + "\u003Cspan" + (pug.attr("style", pug.style(style), true, false)) + "\u003E" + (pug.escape(null == (pug_interp = criterion.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"hide-on-med-and-down flex small\"\u003E\u003Cspan\u003Eimportance\u003C\u002Fspan\u003E\u003Cspan\u003Egranularity\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"hide-on-med-and-down flex small\"\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = fixed2( criterion.weight )) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = Math.floor( criterion.blurIntensity * 100)) ? "" : pug_interp)) + "% - " + (pug.escape(null == (pug_interp = criterion.classCount) ? "" : pug_interp)) + " classes\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var criterion = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth\u003E\u003Cdiv class=\"flex\"\u003E";
let style = `color:${criterion.color}`;
pug_html = pug_html + "\u003Cspan" + (pug.attr("style", pug.style(style), true, false)) + "\u003E" + (pug.escape(null == (pug_interp = criterion.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"hide-on-med-and-down flex small\"\u003E\u003Cspan\u003Eimportance\u003C\u002Fspan\u003E\u003Cspan\u003Egranularity\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"hide-on-med-and-down flex small\"\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = fixed2( criterion.weight )) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = Math.floor( criterion.blurIntensity * 100)) ? "" : pug_interp)) + "% - " + (pug.escape(null == (pug_interp = criterion.classCount) ? "" : pug_interp)) + " classes\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E\u003Ctr class=\"hide-on-large-only\"\u003E\u003Cth\u003ETechnology\u003C\u002Fth\u003E\u003Cth class=\"orange-text\"\u003Escore\u003C\u002Fth\u003E";
// iterate sortedCriteria
;(function(){
  var $$obj = sortedCriteria;
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var criterion = $$obj[pug_index1];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
pug_html = pug_html + "\u003Cth" + (pug.attr("style", pug.style(style), true, false)) + "\u003E" + (pug.escape(null == (pug_interp = criterion.name) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var criterion = $$obj[pug_index1];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
pug_html = pug_html + "\u003Cth" + (pug.attr("style", pug.style(style), true, false)) + "\u003E" + (pug.escape(null == (pug_interp = criterion.name) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E";
// iterate technologies
;(function(){
  var $$obj = technologies;
  if ('number' == typeof $$obj.length) {
      for (var pug_index2 = 0, $$l = $$obj.length; pug_index2 < $$l; pug_index2++) {
        var technology = $$obj[pug_index2];
const style = `background-color:${technology.selected ? "lightgreen" : "white"}`;
pug_html = pug_html + "\u003Ctr" + (" class=\"technology\""+pug.attr("data-technology", technology.name, true, false)+pug.attr("style", pug.style(style), true, false)) + "\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = technology.description) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
const totalWeight = sortedCriteria.reduce((acc, c) => acc + c.weight, 0);
const scoreDetail = sortedCriteria.map((c) => ({name : c.name,weight: fixed2(c.weight), normalizedDominance: fixed2(technology.dominance[c.name] / c.maxDominance), partialScore: fixed2 ((c.weight * technology.dominance[c.name]) / c.maxDominance),normalizedPartialScore: fixed2(c.weight * technology.dominance[c.name] / c.maxDominance / totalWeight) }));
let title = `score: ${fixed2(technology.score)}\n${scoreDetail.map((c) => `+${c.weight}x${c.normalizedDominance} = ${c.partialScore} | +${c.normalizedPartialScore} ${c.name}`).join("\n")}`;
pug_html = pug_html + "\u003Ctd" + (" class=\"orange-text\""+pug.attr("title", title, true, false)) + "\u003E";
// iterate star( technology.score  )
;(function(){
  var $$obj = star( technology.score  );
  if ('number' == typeof $$obj.length) {
      for (var pug_index3 = 0, $$l = $$obj.length; pug_index3 < $$l; pug_index3++) {
        var starIcon = $$obj[pug_index3];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index3 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index3];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftd\u003E";
// iterate sortedCriteria
;(function(){
  var $$obj = sortedCriteria;
  if ('number' == typeof $$obj.length) {
      for (var pug_index4 = 0, $$l = $$obj.length; pug_index4 < $$l; pug_index4++) {
        var criterion = $$obj[pug_index4];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
let title = `${criterion.name}: ${technology.evaluations[criterion.name]}\ndominance: ${technology.dominance[criterion.name]}\nrank: ${technology.rank[criterion.name]}`;
pug_html = pug_html + "\u003Ctd" + (pug.attr("style", pug.style(style), true, false)+pug.attr("title", title, true, false)) + "\u003E\u003Cspan\u003E";
// iterate star( technology.rank[ criterion.name ] / (criterion.classCount - 1) )
;(function(){
  var $$obj = star( technology.rank[ criterion.name ] / (criterion.classCount - 1) );
  if ('number' == typeof $$obj.length) {
      for (var pug_index5 = 0, $$l = $$obj.length; pug_index5 < $$l; pug_index5++) {
        var starIcon = $$obj[pug_index5];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index5 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index5];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index4 in $$obj) {
      $$l++;
      var criterion = $$obj[pug_index4];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
let title = `${criterion.name}: ${technology.evaluations[criterion.name]}\ndominance: ${technology.dominance[criterion.name]}\nrank: ${technology.rank[criterion.name]}`;
pug_html = pug_html + "\u003Ctd" + (pug.attr("style", pug.style(style), true, false)+pug.attr("title", title, true, false)) + "\u003E\u003Cspan\u003E";
// iterate star( technology.rank[ criterion.name ] / (criterion.classCount - 1) )
;(function(){
  var $$obj = star( technology.rank[ criterion.name ] / (criterion.classCount - 1) );
  if ('number' == typeof $$obj.length) {
      for (var pug_index6 = 0, $$l = $$obj.length; pug_index6 < $$l; pug_index6++) {
        var starIcon = $$obj[pug_index6];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index6 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index6];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index2 in $$obj) {
      $$l++;
      var technology = $$obj[pug_index2];
const style = `background-color:${technology.selected ? "lightgreen" : "white"}`;
pug_html = pug_html + "\u003Ctr" + (" class=\"technology\""+pug.attr("data-technology", technology.name, true, false)+pug.attr("style", pug.style(style), true, false)) + "\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = technology.description) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
const totalWeight = sortedCriteria.reduce((acc, c) => acc + c.weight, 0);
const scoreDetail = sortedCriteria.map((c) => ({name : c.name,weight: fixed2(c.weight), normalizedDominance: fixed2(technology.dominance[c.name] / c.maxDominance), partialScore: fixed2 ((c.weight * technology.dominance[c.name]) / c.maxDominance),normalizedPartialScore: fixed2(c.weight * technology.dominance[c.name] / c.maxDominance / totalWeight) }));
let title = `score: ${fixed2(technology.score)}\n${scoreDetail.map((c) => `+${c.weight}x${c.normalizedDominance} = ${c.partialScore} | +${c.normalizedPartialScore} ${c.name}`).join("\n")}`;
pug_html = pug_html + "\u003Ctd" + (" class=\"orange-text\""+pug.attr("title", title, true, false)) + "\u003E";
// iterate star( technology.score  )
;(function(){
  var $$obj = star( technology.score  );
  if ('number' == typeof $$obj.length) {
      for (var pug_index7 = 0, $$l = $$obj.length; pug_index7 < $$l; pug_index7++) {
        var starIcon = $$obj[pug_index7];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index7 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index7];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftd\u003E";
// iterate sortedCriteria
;(function(){
  var $$obj = sortedCriteria;
  if ('number' == typeof $$obj.length) {
      for (var pug_index8 = 0, $$l = $$obj.length; pug_index8 < $$l; pug_index8++) {
        var criterion = $$obj[pug_index8];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
let title = `${criterion.name}: ${technology.evaluations[criterion.name]}\ndominance: ${technology.dominance[criterion.name]}\nrank: ${technology.rank[criterion.name]}`;
pug_html = pug_html + "\u003Ctd" + (pug.attr("style", pug.style(style), true, false)+pug.attr("title", title, true, false)) + "\u003E\u003Cspan\u003E";
// iterate star( technology.rank[ criterion.name ] / (criterion.classCount - 1) )
;(function(){
  var $$obj = star( technology.rank[ criterion.name ] / (criterion.classCount - 1) );
  if ('number' == typeof $$obj.length) {
      for (var pug_index9 = 0, $$l = $$obj.length; pug_index9 < $$l; pug_index9++) {
        var starIcon = $$obj[pug_index9];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index9 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index9];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index8 in $$obj) {
      $$l++;
      var criterion = $$obj[pug_index8];
if (criterion.weight > 0) {
let style = `color:${criterion.color}`;
let title = `${criterion.name}: ${technology.evaluations[criterion.name]}\ndominance: ${technology.dominance[criterion.name]}\nrank: ${technology.rank[criterion.name]}`;
pug_html = pug_html + "\u003Ctd" + (pug.attr("style", pug.style(style), true, false)+pug.attr("title", title, true, false)) + "\u003E\u003Cspan\u003E";
// iterate star( technology.rank[ criterion.name ] / (criterion.classCount - 1) )
;(function(){
  var $$obj = star( technology.rank[ criterion.name ] / (criterion.classCount - 1) );
  if ('number' == typeof $$obj.length) {
      for (var pug_index10 = 0, $$l = $$obj.length; pug_index10 < $$l; pug_index10++) {
        var starIcon = $$obj[pug_index10];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index10 in $$obj) {
      $$l++;
      var starIcon = $$obj[pug_index10];
pug_html = pug_html + "\u003Ci class=\"material-icons\"\u003E" + (pug.escape(null == (pug_interp = starIcon) ? "" : pug_interp)) + "\u003C\u002Fi\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";
    }.call(this, "Array" in locals_for_with ?
        locals_for_with.Array :
        typeof Array !== 'undefined' ? Array : undefined, "Math" in locals_for_with ?
        locals_for_with.Math :
        typeof Math !== 'undefined' ? Math : undefined, "Number" in locals_for_with ?
        locals_for_with.Number :
        typeof Number !== 'undefined' ? Number : undefined, "criteria" in locals_for_with ?
        locals_for_with.criteria :
        typeof criteria !== 'undefined' ? criteria : undefined, "technologies" in locals_for_with ?
        locals_for_with.technologies :
        typeof technologies !== 'undefined' ? technologies : undefined));
    ;;return pug_html;};
template.twoDimensionControlPanel = function(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;
    var locals_for_with = (locals || {});
    
    (function (criteria) {
      pug_html = pug_html + "\u003Csvg\u003E";
// iterate criteria 
;(function(){
  var $$obj = criteria ;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var criterion = $$obj[index];
pug_html = pug_html + "\u003Cg" + (" class=\"draggable\""+pug.attr("id", criterion.name, true, false)) + "\u003E\u003Cellipse" + (" cx=\"15\""+pug.attr("cy", index * 15 + 10, true, false)) + "\u003E\u003C\u002Fellipse\u003E\u003Ctext" + (" x=\"20\""+pug.attr("y", index * 15 + 10, true, false)) + "\u003E\u003Ctspan\u003E" + (pug.escape(null == (pug_interp = criterion.description) ? "" : pug_interp)) + "\u003C\u002Ftspan\u003E\u003C\u002Ftext\u003E\u003C\u002Fg\u003E";
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var criterion = $$obj[index];
pug_html = pug_html + "\u003Cg" + (" class=\"draggable\""+pug.attr("id", criterion.name, true, false)) + "\u003E\u003Cellipse" + (" cx=\"15\""+pug.attr("cy", index * 15 + 10, true, false)) + "\u003E\u003C\u002Fellipse\u003E\u003Ctext" + (" x=\"20\""+pug.attr("y", index * 15 + 10, true, false)) + "\u003E\u003Ctspan\u003E" + (pug.escape(null == (pug_interp = criterion.description) ? "" : pug_interp)) + "\u003C\u002Ftspan\u003E\u003C\u002Ftext\u003E\u003C\u002Fg\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fsvg\u003E";
    }.call(this, "criteria" in locals_for_with ?
        locals_for_with.criteria :
        typeof criteria !== 'undefined' ? criteria : undefined));
    ;;return pug_html;};
template.twoSliderControlPanel = function(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;
    var locals_for_with = (locals || {});
    
    (function (criteria) {
      pug_html = pug_html + "\u003Cform\u003E";
// iterate criteria 
;(function(){
  var $$obj = criteria ;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var criterion = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv class=\"row\"\u003E\u003Clabel class=\"col l2 m12 s12\"\u003E" + (pug.escape(null == (pug_interp = criterion.description) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Clabel class=\"col l5 m6 s12\"\u003Eweight\u003Cdiv class=\"range-field\"\u003E\u003Cinput" + (" type=\"range\""+pug.attr("data-criterion", criterion.name, true, false)+" data-parameter=\"weight\""+pug.attr("value", criterion.weight, true, false)+" min=\"0\" max=\"100\" step=\"1\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003Clabel class=\"col l5 m6 s12\"\u003EGranularity\u003Cdiv class=\"range-field\"\u003E\u003Cinput" + (" type=\"range\""+pug.attr("data-criterion", criterion.name, true, false)+" data-parameter=\"blurIntensity\""+pug.attr("value", criterion.blurIntensity, true, false)+" min=\"0\" max=\"1\" step=\"0.01\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var criterion = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv class=\"row\"\u003E\u003Clabel class=\"col l2 m12 s12\"\u003E" + (pug.escape(null == (pug_interp = criterion.description) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Clabel class=\"col l5 m6 s12\"\u003Eweight\u003Cdiv class=\"range-field\"\u003E\u003Cinput" + (" type=\"range\""+pug.attr("data-criterion", criterion.name, true, false)+" data-parameter=\"weight\""+pug.attr("value", criterion.weight, true, false)+" min=\"0\" max=\"100\" step=\"1\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003Clabel class=\"col l5 m6 s12\"\u003EGranularity\u003Cdiv class=\"range-field\"\u003E\u003Cinput" + (" type=\"range\""+pug.attr("data-criterion", criterion.name, true, false)+" data-parameter=\"blurIntensity\""+pug.attr("value", criterion.blurIntensity, true, false)+" min=\"0\" max=\"1\" step=\"0.01\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fform\u003E";
    }.call(this, "criteria" in locals_for_with ?
        locals_for_with.criteria :
        typeof criteria !== 'undefined' ? criteria : undefined));
    ;;return pug_html;}
export { template } ;