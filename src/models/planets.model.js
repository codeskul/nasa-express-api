const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("nasa-api:planets-model");

const planets = require("./planets.mongo");
const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          /** Static Variable instead of database */
          // habitablePlanets.push(data);

          /** TODO: Replace below create with insert + update = upsert */
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        debug(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = await planets.count();
        debug(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
};

const getAllPlanets = async () => {
  return await planets.find();
};

const savePlanet = async (planet) => {
  try {
    /**UPSERT Operation */
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    debug(`Could not save planet ${error}`);
  }
};

module.exports = { loadPlanetsData, getAllPlanets };
