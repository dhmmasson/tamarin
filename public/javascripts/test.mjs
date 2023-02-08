import { Sorter } from "./Sorter.mjs";
import { template } from "./template.mjs";
const sorter = new Sorter([], []);
window.sorter = sorter;

$.get("/api/criteria", function (data) {
  sorter.criteria = data.criteria;
  test();
});

$.get("/api/technologies", function (data) {
  sorter.technologies = data.technologies;
  test();
});

function test() {
  if (sorter.criteria.all.length > 0 && sorter.technologies.all.length > 0) {
    sorter.on(Sorter.eventType.sorted, printer);
    sorter.on(Sorter.eventType.sorted, () => {
      console.log("hello");
      $("#result")
        .empty()
        .append(
          template.table({
            technologies: sorter.technologies.sorted,
            criteria: sorter.criteria.all,
          })
        );
    });
    sorter.criteria.all[0].weight = 0;
    sorter.criteria.all[1].weight = 1;

    sorter.criteria.all[1].blurIntensity = 0;
    sorter.criteria.all[1].blurIntensity = 0.1;
    sorter.criteria.all[1].blurIntensity = 0.2;

    sorter.criteria.all[3].blurIntensity = 0.2;
    sorter.criteria.all[3].weight = 1;

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

    // const confortBlur = $( "#comfort_blur" ) ;
    // confortBlur.change( () => {
    //
    //   sorter.criteria.map.Comfort.blurIntensity = confortBlur.val() / 100 ;
    //
    // } ) ;
    // const confortWeight = $( "#comfort_weight" ) ;
    // confortWeight.change( () => { sorter.criteria.map.Comfort.weight = confortWeight.val() / 20 ; } ) ;
    //
  }
}

function round(number, precision) {
  function shift(number, exponent) {
    const numArray = ("" + number).split("e");
    return +(
      numArray[0] +
      "e" +
      (numArray[1] ? +numArray[1] + exponent : exponent)
    );
  }
  return shift(Math.round(shift(number, +precision)), -precision);
}
function printer(eventType, sorter) {
  const { criteria, technologies } = sorter;
  const printableArray = [];
  for (const technology of technologies.sorted) {
    const line = { name: technology.name };
    for (const criterion of criteria.all) {
      if (criterion.weight > 0) {
        line[criterion.name + "min"] = round(
          technology.bounds[criterion.name],
          2
        );
        line[criterion.name + "max"] = technology.evaluations[criterion.name];
        line[criterion.name + "dom"] = technology.dominance[criterion.name];
      }
    }
    line.score = technology.score;
    printableArray.push(line);
  }
  console.table(printableArray);
}
