/**
 * @file the main functions
 * @author dhmmasson
 */
import Papa from "papaparse";
import { Tabs, Sidenav, FloatingActionButton } from "@materializecss/materialize";
window.M = { Tabs, Sidenav, FloatingActionButton };

import * as SVGmodule from "./svg.esm.js";
window.SVG = SVGmodule;


import { Sorter } from "./Sorter.mjs";
import { Criterion } from "./models/Criterion.mjs";
import { Technology } from "./models/Technology.mjs";
import { UI } from "./UI/twoDimensionControlPanel.mjs";
import { ParallelCoordinatesPlotPanel } from "./UI/parallelCoordinates.mjs";
import { template } from "./template.mjs";
import { Downloader } from "./Downloader.mjs";
import { Logs } from "./Logs.mjs";
const sorter = new Sorter([], []);
let ui = null;
let parallelCoordinatesPlotPanel;
let logs = null;

document.addEventListener('DOMContentLoaded', load);

function load() {
  document.getElementById('csv').addEventListener('change', function (e) {
    loadFromCSV(e.target.files[0]);
  });
  document.getElementById('loadDB').addEventListener('click', loadDataFromDb);
  if (localStorage.getItem("criteria") === null) {
    loadDataFromDb();
  } else {
    loadDataLocally();
  }
}

function empty(id) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = '';
}
function cleanUI() {
  const panels = ['controlPanel', 'ParallelCoordinatesPlotPanel', 'logs']
  panels.forEach(empty)
}

/**
 * loadData - load criteria and technologies
 *
 * @param  {function} call function getCriteria
 * @param  {function} call function getTechnologies
 */
async function loadDataFromDb() {
  cleanUI();
  // Wait for both promises to resolve
  const [criteria, technologies] = await Promise.all([
    getCriteria(),
    getTechnologies(),
  ]);
  initSorter(criteria, technologies);
}

/**
 * Save the data locally to avoid reloading from the database or from the csv file
 */
function saveDataLocally() {
  localStorage.setItem("criteria", JSON.stringify(sorter.criteria.all));
  localStorage.setItem("technologies", JSON.stringify(sorter.technologies.all));
}

/**
 * Load the data locally
 * */

function loadDataLocally() {
  const criteria = JSON.parse(localStorage.getItem("criteria"));
  const technologies = JSON.parse(localStorage.getItem("technologies"));
  initSorter(criteria, technologies);
}

/**
 *
 * @param {*} key a key of the form "name (ASC|DESC)"
 * @returns  [key, name, order] original key, cleaned name of the criterion, order of the criterion (ascending (default) or descending)
 */
const parseNameOrder = (key) => {
  const order = key.match(/\((ASC|DESC)\)$/);
  const name = key.replace(/\((ASC|DESC)\)$/, "").trim();
  const mapper = { ASC: "ascending", DESC: "descending" };
  return order ? [key, name, mapper[order[1]]] : [key, name, mapper["ASC"]];
};

const reduceMin = (key) => (min, p) => (p[key] < min ? p[key] : min);
const reduceMax = (key) => (max, p) => (p[key] > max ? p[key] : max);
const filterFieldOut = ([, name]) =>
  name != "name" && name != "description" && name != "technology";

/**
 * Load the data from a CSV file
 * @param {File} csvFile
 * */
function loadFromCSV(csvFile) {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    worker: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete: function (results) {
      const criteria = results.meta.fields
        .map(parseNameOrder)
        .filter(filterFieldOut)
        .map(([key, name, order]) => ({
          name: name,
          description: name,
          min: results.data.reduce(reduceMin(key), results.data[0][key]),
          max: results.data.reduce(reduceMax(key), results.data[0][key]),
          sortingorder: order,
        }));
      const technologies = results.data.map((technology, i) => {
        if (technology === undefined) return;
        const t = {
          technology: i,
          name: technology.name || i,
          description:
            technology.description ||
            technology.name ||
            `${Math.ceil(100 * technology.TS)}_${Math.ceil(
              100 * technology.WFS
            )}`,
          evaluations: Object.entries(technology)
            .filter(
              // filter out the name, description and technology fields
              ([name, value]) =>
                name != "name" && name != "description" && name != "technology"
            )
            .map(
              // map the remaining fields to the criterion format)
              ([name, value]) => [parseNameOrder(name)[1], value]
            )
            .reduce(
              // reduce the array to an object
              (obj, [name, value]) => ({ ...obj, [name]: value }),
              {}
            ),
        };
        return t;
      });
      initSorter(criteria, technologies);
    },
  });
}
/**
 * getCriteria - get criteria from db to sorter
 *
 * @param
 */
async function getCriteria() {
  const response = await fetch("/api/criteria");
  const data = await response.json();
  return data.criteria;
}

/**
 * getTechnologies - get technologies from db to sorter then call sorter function
 *
 * @param
 */
async function getTechnologies() {
  // fetch asynchrone
  const response = await fetch("/api/technologies");
  const data = await response.json();
  return data.technologies;
}

/**
 * initSorter - initialize the the window
 */

function initSorter(criteria, technologies) {
  cleanUI();
  sorter.criteria = criteria;
  sorter.technologies = technologies;
  saveDataLocally();
  logs = new Logs();
  ui = new UI(document.getElementById('controlPanel'), sorter.criteria.all, () => {
    loadState();
    attachEventListener();
  });

  parallelCoordinatesPlotPanel = new ParallelCoordinatesPlotPanel(
    document.getElementById('ParallelCoordinatesPlotPanel')
  );
}

/**
 * loadState - if there is nothing in the localStorage, only one criteria will be displayed. Otherwise, it will display what's in the localStorage
 *
 * @param
 */
function loadState() {
  if (localStorage.getItem("sorterCriteria") === null) {
    sorter.criteria.all[0].weight = 1;
  } else {
    let criteria = JSON.parse(localStorage.getItem("sorterCriteria"));
    for (var i = 0; i < criteria.length; i++) {
      let criterion = criteria[i];
      if (!sorter.criteria.map[criterion.name]) continue;
      sorter.criteria.map[criterion.name].weight = criterion.weight;
      sorter.criteria.map[criterion.name].blurIntensity =
        criterion.blurIntensity;
    }
    updateUI();
  }
}

/**
 * saveToLocalStorage - add name, blur and weight to localStorage
 *
 * @param {function} get name, blur and weight from export in Criterion.mjs if weight > 0
 * @param {function} convert name, blur and weight into string
 * @param {function} add this date to localStorage
 */
function saveToLocalStorage() {
  const exportedCriteria = sorter.criteria.all.map((e) => e.export());
  const savedCriteria =
    JSON.parse(localStorage.getItem("sorterCriteria")) || [];
  // Remove saved criteria if their weight in exported criteria is 0
  const filteredSavedCriteria = savedCriteria.filter(
    (c) => !(exportedCriteria.find((e) => e.name === c.name)?.weight < 0)
  );
  // Update saved criteria if their weight in exported criteria is > 0
  const updatedSavedCriteria = filteredSavedCriteria.map((c) => {
    const e = exportedCriteria.find((e) => e.name === c.name);
    if (e?.weight > 0) {
      c.weight = e.weight;
      c.blurIntensity = e.blurIntensity;
    }
    return c;
  });
  // Add new criteria to updated saved criteria
  const newCriteria = exportedCriteria.filter(
    (e) => !updatedSavedCriteria.find((c) => c.name === e.name)
  );
  const allCriteria = [...updatedSavedCriteria, ...newCriteria];
  localStorage.setItem("sorterCriteria", JSON.stringify(allCriteria));
}

/**
 * attachEventListener - for each event, a sorting is done, saved to localStorage and create csv with technologies
 *
 * @param
 */
function attachEventListener() {
  const downloader = new Downloader(document.querySelector('#saveButton'));

  for (var i = 0; i < sorter.criteria.all.length; i++) {
    let criterion = sorter.criteria.all[i];
    criterion.on(Criterion.eventType.blurIntensityUpdated, (t, c) =>
      logs.updateData(c, t)
    );
    criterion.on(Criterion.eventType.weightUpdated, (t, c) =>
      logs.updateData(c, t)
    );
  }
  let extension = null;
  sorter.on(Sorter.eventType.sorted, (sorted) => {
    clearTimeout(extension);
    extension = setTimeout(() => {
      updateUI();
    }, 100);
    updateUI(10);
    saveToLocalStorage();
    downloader.updateCSV(sorter.technologies);
  });
}

function updateUI(longueur) {
  updateTable(longueur);
  loadParallelCoordinatesPlotPanel();
}

/**
 * updateTable -
 *
 * @param
 */
function updateTable(longueur) {
  longueur = longueur ? longueur : sorter.technologies.sorted.length;
  try {
    // Get the element with ID 'result'
    const resultElement = document.getElementById('result');
    // Clear the contents of the 'result' element
    resultElement.innerHTML = '';

    // Create the new content using the template
    const newContent = template.table({
      technologies: sorter.technologies.sorted.slice(0, longueur),
      criteria: sorter.criteria.all,
    });

    // Append the new content to the 'result' element
    resultElement.insertAdjacentHTML('beforeend', newContent);


    makeTableInteractive();
  } catch (e) {
    console.log(e);
  }
}

function makeTableInteractive() {

  document.querySelector('#result tbody').addEventListener('click', function (e) {
    if (e.target.closest('tr.technology')) {
      const element = e.target.closest("tr.technology");
      console.log(element.dataset.technology);
      if (element.dataset.technology) {
        const technologie = sorter.technologies.map[element.dataset.technology];
        technologie.selected = !technologie.selected;
        updateTable();
        loadParallelCoordinatesPlotPanel();
      }
    }
  });

  let extension = null;

  document.querySelector('#result tbody').addEventListener('mouseover', function (e) {
    if (e.target.closest('tr.technology')) {
      if (e.buttons === 1) {
        const element = e.target.closest("tr.technology");
        console.log(element.dataset.technology);
        if (element.dataset.technology) {
          const technologie = sorter.technologies.map[element.dataset.technology];
          technologie.selected = !technologie.selected;
          element.style.backgroundColor = technologie.selected
            ? "yellow"
            : "white";
          loadParallelCoordinatesPlotPanel();
          clearTimeout(extension);
          extension = setTimeout(() => {
            updateUI();
          }, 100);
        }
      }
    }
  });
}

/**
 * loadControlPanel - creates a 2D control panel & 2 sliders
 *
 * @param {string}    choose mode
 */
function loadControlPanel(mode) {
  if (mode === "2Dimension") {
    load2DimensionControlPanel();
  } else {
    load2SliderControlPanel();
  }
}

/**
 * load2SliderControlPanel -
 *
 * @param
 */
function load2SliderControlPanel() {
  // Get the element with ID 'controlPanel'
  const controlPanel = document.getElementById('controlPanel');

  // Clear the contents of the 'controlPanel' element
  controlPanel.innerHTML = '';

  // Generate the new content using the template
  const newContent = template.twoSliderControlPanel({ criteria: sorter.criteria.all });

  // Insert the new content into the 'controlPanel'
  controlPanel.insertAdjacentHTML('beforeend', newContent);

  // Add event listeners to the input elements within 'controlPanel'
  controlPanel.addEventListener('change', function (e) {
    const target = e.target;

    // Check if the changed element is an input
    if (target.tagName === 'INPUT') {
      const input = target;
      const criterionName = input.dataset.criterion;
      const parameter = input.dataset.parameter;
      const criterion = sorter.criteria.map[criterionName];

      // Update the criterion parameter
      if (criterion) {
        criterion[parameter] = input.value;
      }
    }
  });

}

/**
 * load2DimensionControlPanel -
 *
 * @param
 */
function load2DimensionControlPanel() {
  // Get the element with ID 'controlPanel'
  const controlPanel = document.getElementById('controlPanel');

  // Clear the contents of the 'controlPanel' element
  controlPanel.innerHTML = '';

  // Generate the new content using the template
  const newContent = template.twoDimensionControlPanel({ criteria: sorter.criteria.all });

  // Insert the new content into the 'controlPanel'
  controlPanel.insertAdjacentHTML('beforeend', newContent);

  // Find elements with class 'draggable' and apply draggable functionality
  controlPanel.querySelectorAll('.draggable').forEach(element => {
    const label = ui.svg(element);
    element.addEventListener('mousedown', function (event) {
      const node = label
        .ellipse()
        .draggable()
        .move(2.5 + event.offsetX, 2.5 + event.offsetY);
      node.remember("_draggable").startDrag(event);
    });
  });

}

/**
 * Loads parralel coordinates plot panel
 * @param {string} mode choose mode
 *
 */
function loadParallelCoordinatesPlotPanel(longueur) {
  longueur = longueur ? longueur : sorter.technologies.sorted.length;
  if (sorter.criteria.all.filter((e) => e.weight > 0).length < 2) return;
  const activeCriteria = sorter.criteria.all
    .filter((e) => e.weight > 0)
    .sort((a, b) => a.weight - b.weight);
  parallelCoordinatesPlotPanel.update(
    sorter.technologies.sorted.slice(0, longueur),
    activeCriteria
  );
}
