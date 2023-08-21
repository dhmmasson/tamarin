/**
 * @file the main functions
 * @author dhmmasson
 */

import { Sorter } from "./Sorter.mjs";
import { Criterion } from "./models/Criterion.mjs";
import { Technology } from "./models/Technology.mjs";
import { UI } from "./UI/twoDimensionControlPanel.mjs";
import { ParallelCoordinatesPlotPanel } from "./UI/parallelCoordinates.mjs";
import { template } from "./template.mjs";
import { Downloader } from "./Downloader.mjs";
import * as SVGmodule from "./svg.esm.js";
import { Logs } from "./Logs.mjs";
window.SVG = SVGmodule;
const sorter = new Sorter([], []);
let ui = null;
let parallelCoordinatesPlotPanel;
let logs = null;
$(load());
$("#csv").on("change", function (e) {
  loadFromCSV(e.target.files[0]);
});
$("#loadDB").on("click", loadDataFromDb);

function load() {
  if (localStorage.getItem("criteria") === null) {
    loadDataFromDb();
  } else {
    loadDataLocally();
  }
}

function cleanUI() {
  $("#controlPanel").empty();
  $("#ParallelCoordinatesPlotPanel").empty();
  $("#logs").empty();
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

const reduceMin = (key) => (min, p) => p[key] < min ? p[key] : min;
const reduceMax = (key) => (max, p) => p[key] > max ? p[key] : max;
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
  ui = new UI($("#controlPanel")[0], sorter.criteria.all, () => {
    loadState();
    attachEventListener();
  });
  parallelCoordinatesPlotPanel = new ParallelCoordinatesPlotPanel(
    $("#ParallelCoordinatesPlotPanel")[0]
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
  const downloader = new Downloader($("#saveButton")[0]);

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
    $("#result")
      .empty()
      .append(
        template.table({
          technologies: sorter.technologies.sorted.slice(0, longueur),
          criteria: sorter.criteria.all,
        })
      );

    makeTableInteractive();
  } catch (e) {
    console.log(e);
  }
}

function makeTableInteractive() {
  $("#result tbody").on("click", "tr.technology", function (e) {
    const element = $(e.target).parents("tr.technology")[0];
    console.log(element.dataset.technology);
    if (element.dataset.technology) {
      const technologie = sorter.technologies.map[element.dataset.technology];
      technologie.selected = !technologie.selected;
      updateTable();
      loadParallelCoordinatesPlotPanel();
    }
  });

  let extension = null;
  $("#result tbody").on("mouseover", "tr.technology", function (e) {
    if (e.buttons === 1) {
      const element = $(e.target).parents("tr.technology")[0];
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
  $("#controlPanel")
    .empty()
    .append(template.twoSliderControlPanel({ criteria: sorter.criteria.all }))
    .find("input")
    .change(function (e) {
      const input = $(e.target),
        criterionName = input.data("criterion"),
        parameter = input.data("parameter"),
        criterion = sorter.criteria.map[criterionName];
      criterion[parameter] = input.val();
    });
}

/**
 * load2DimensionControlPanel -
 *
 * @param
 */
function load2DimensionControlPanel() {
  $("#controlPanel")
    .empty()
    .append(
      template.twoDimensionControlPanel({ criteria: sorter.criteria.all })
    )
    .find(".draggable")
    .each(
      /**
       * function - apply draggable
       * @this {Jquery~element} an .draggable element
       */
      function () {
        const label = ui.svg(this);
        label.mousedown(function (event) {
          const node = label
            .ellipse()
            .draggable()
            .move(2.5 + event.offsetX, 2.5 + event.offsetY);
          node.remember("_draggable").startDrag(event);
        });
      }
    );
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
