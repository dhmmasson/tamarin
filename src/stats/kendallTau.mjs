import Statistics from "Statistics.js";
import fs from "fs";
import papaparse from "papaparse";

const experiencePlan = generatePlan(
  { tau: {} },
  {
    coefficients: {
      random: [0],
      original: [1],
    },
    blur: [20],
    shape: ["binomial"],
  }
);
const nbDistribution = 1;
const nbEssai = 1;
const listLength = 20;
function generatePlan(results, plan) {
  const names = Object.getOwnPropertyNames(plan);
  if (names.length > 0) {
    const [name] = names;
    const values = plan[name];
    delete plan[name];
    const newResult = {};
    if (values instanceof Array) {
      for (const val of values) {
        for (const testName in results) {
          newResult[testName + "_" + name + ":" + val] = {
            ...results[testName],
          };
          newResult[testName + "_" + name + ":" + val][name] = val;
        }
      }
    } else {
      const intermediairy = generatePlan(results, values);
      for (const varName in intermediairy) {
        newResult[varName] = {};
        newResult[varName][name] = intermediairy[varName];
      }
    }
    return generatePlan(newResult, plan);
  }
  return results;
}
const distribution = computeDistribution(listLength);
init();

test();
function test(nbClassement, nbRepetition, nbAlternative, planEx) {
  const vars = {
    original: "ordinal",
    random: "ordinal",
  };
  const results = [];

  // DO as many ordering as required
  for (
    let classementIndex = 0;
    classementIndex < nbClassement;
    classementIndex++
  ) {
    let ordering = generateSeed(nbAlternative);
    // For each ordering, do multiple tries
    // reroll 0 distance
    let maxReroll = 10;

    for (
      let repetitionIndex = 0;
      repetitionIndex < nbRepetition;
      repetitionIndex++
    ) {
      const distribution = generateData(nbAlternative, ordering);
      const stats = new Statistics(distribution, vars);
      const kendall = stats.kendallsTau("original", "random").b;
      const maxDistance = (1 - kendall.tauB) / 2;
      if (maxDistance === 0) {
        // generate Again
        if (maxReroll--) repetitionIndex--;
      } else {
        const result = { maxDistance: maxDistance };
        for (const experience in experiencePlan) {
          const kendalls = computeKendallTau(
            distribution,
            planEx[experience],
            maxDistance
          );
          result[experience + "_original"] = kendalls.originalD;
          result[experience + "_random"] = kendalls.randomD;
        }
        results.push(result);
      }
    }
  }
  return results;
}

function init() {
  let vars = {
    original: "ordinal",
    random: "ordinal",
  };
  const results = test(nbDistribution, nbEssai, listLength, experiencePlan);
  console.table(results.sort((a, b) => a.tauB - b.tauB));
  vars = {};
  for (const name of Object.getOwnPropertyNames(results[0])) {
    vars[name] = "metric";
    vars[name] = "metric";
  }

  const resultStat = new Statistics(results, vars);

  const statsReport = [];
  statsReport.push(["original", "random", "blur", "mean", "std"]);
  for (const varname in vars) {
    const mean = resultStat.mean(varname);
    const standardDeviation = resultStat.standardDeviation(varname);
    const experience =
      experiencePlan[varname.slice(0, varname.lastIndexOf("_"))];

    console.log(varname, experience, mean, standardDeviation);
    if (experience)
      statsReport.push([
        experience.coefficients.original,
        experience.coefficients.random,
        experience.blur,
        mean,
        standardDeviation,
      ]);
  }
  const csv = papaparse.unparse(JSON.stringify(statsReport));
  fs.writeFile("stats.csv", csv, "utf8", console.log);

  fs.writeFile("result.csv", papaparse.unparse(results), "utf8", console.log);

  const rawValue = exportRaw(results);
  fs.writeFile("raw.csv", papaparse.unparse(rawValue), "utf8", console.log);
}

function exportRaw(results) {
  const rawValue = [];
  for (const i in results) {
    const line = results[i];
    const { maxDistance } = line;
    for (const name in line) {
      const value = line[name];
      if (name !== "maxDistance") {
        // return a object with var:val, from a string _var:val_var:val... skip var that dont have values
        const header = name
          .split("_")
          .map((e) => e.split(":"))
          .reduce((a, e) => {
            if (e[1]) [, a[e[0]]] = e;
            return a;
          }, {});
        header.reference = name.slice(name.lastIndexOf("_") + 1);
        header.maxDistance = maxDistance;
        header.value = value;
        rawValue.push(header);
      }
    }
  }
  return rawValue;
}

function normalizedTauB(stats, reference, maxDistance) {
  return (
    (1 - stats.kendallsTau(reference, "baboonOrder").b.tauB) / 2 / maxDistance
  );
}

function computeKendallTau(values, experience, maxDistance) {
  const vars = {
    original: "ordinal",
    random: "ordinal",
    baboonOrder: "ordinal",
  };
  const data = computeBaboon(
    values,
    experience.shape,
    experience.coefficients,
    experience.blur
  );
  console.table(data.sort((a, b) => a.random - b.random));
  const stats = new Statistics(data, vars);
  return {
    originalD: normalizedTauB(stats, "original", maxDistance),
    randomD: normalizedTauB(stats, "random", maxDistance),
  };
}

function computeBaboon(values, shape, weight, blur) {
  return recomputeOrder(values, shape, blur)
    .map((e) => {
      e.baboon =
        (e.original / listLength) * weight.original +
        e.normalize * weight.random;
      return e;
    })
    .sort((a, b) => a.baboon - b.baboon)
    .map((e, i, arr) => {
      e.baboonOrder =
        e.baboon === (arr[i - 1] || {}).baboon ? arr[i - 1].baboonOrder : i;
      return e;
    });
}

function recomputeOrder(values, shape, blur) {
  let larger = 0;
  const array = values
    .map((e) => ({
      ...e,
      blurredValue: e.value[shape] - blur / 100,
    }))
    .sort((a, b) => a.blurredValue - b.blurredValue)
    .map((e, i, arr) => {
      while (e.blurredValue > arr[larger].value[shape]) {
        larger++;
      }
      return {
        ...e,
        dominance: larger,
      };
    })
    .sort((a, b) => a.dominance - b.dominance)
    .map((e, i, arr) => {
      e.normalize = e.dominance / arr[arr.length - 1].dominance;
      return e;
    })
    .map((e, i, arr) => {
      e.rank =
        e.dominance === (arr[i - 1] || {}).dominance ? arr[i - 1].rank : i;
      return e;
    });

  return array;
}

/**
 * generateSeed - return a seeded array ( a distribution )
 *
 * @param  {number} alternativeCount length of the array
 * @return {}   description
 */
const generateSeed = (alternativeCount) =>
  Array(alternativeCount)
    .fill(1)
    //Generate original ordering
    .map((v, i) => ({
      original: i,
      //generate a seed for the second ordering
      seed: Math.random(),
    }))
    //sort by seed
    .sort((a, b) => a.seed - b.seed)
    //generate random ordering from the seed
    .map((a, i) => ({
      ...a,
      random: i,
    }));

/**
 * generateData - Generate the distribution
 *
 * @param  {type} alternatives description
 * @return {type}              description
 */
function generateData(alternatives) {
  const baseArray =
    alternatives instanceof Array
      ? alternatives.slice()
      : generateSeed(alternatives);
  return baseArray
    .sort((a, b) => a.seed - b.seed)
    .map((a, i) => ({
      ...a,
      value: {
        uniform: distribution.uniform(i),
        binomial: distribution.binomial(i),
        sinus: distribution.sinus(i),
      },
    }));
}

/**
 * computeDistribution - generate the shape array for the distribution
 *
 * @param  {type} n description
 * @return {type}   description
 */
function computeDistribution(n) {
  // Compute some weight
  const Weights = {};
  Weights.uniform = Array(n).fill(1);
  Weights.binomial = Array(n)
    .fill(1)
    .map((e, i) => Math.pow(i - n / 2, 2));
  Weights.sinus = Array(n)
    .fill(1)
    .map((e, i) => Math.sin((i / n) * Math.PI));
  // compute total
  const Total = {};
  Total.uniform = Weights.uniform.reduce((acc, e) => acc + e, 0);
  Total.binomial = Weights.binomial.reduce((acc, e) => acc + e, 0);
  Total.sinus = Weights.sinus.reduce((acc, e) => acc + e, 0);
  // Normalize
  const Size = {};
  Size.uniform = Weights.uniform.map((e) => e / Total.uniform);
  Size.binomial = Weights.binomial.map((e) => e / Total.binomial);
  Size.sinus = Weights.sinus.map((e) => e / Total.sinus);
  // computeCenter
  const Center = {};
  (Center.uniform = Size.uniform.slice()).reduce((acc, e, i, arr) => {
    const size = arr[i];
    arr[i] = acc + size / 2;
    return acc + size;
  }, 0);
  (Center.binomial = Size.binomial.slice()).reduce((acc, e, i, arr) => {
    const size = arr[i];
    arr[i] = acc + size / 2;
    return acc + size;
  }, 0);
  (Center.sinus = Size.sinus.slice()).reduce((acc, e, i, arr) => {
    const size = arr[i];
    arr[i] = acc + size / 2;
    return acc + size;
  }, 0);

  const randomize = (cellCenters, cellSizes) => (n) =>
    cellCenters[n] + (Math.random() - 0.5) * cellSizes[n];
  return {
    uniform: randomize(Center.uniform, Size.uniform),
    binomial: randomize(Center.binomial, Size.binomial),
    sinus: randomize(Center.sinus, Size.sinus),
  };
}
