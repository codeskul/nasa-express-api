const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["PSTECH", "ISRO"],
  upcoming: true,
  success: true,
};

const getAllLaunches = async () => {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
};

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
};
saveLaunch(launch);

const getLatestFlightNumber = async () => {
  const latestFlight = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestFlight) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestFlight.flightNumber;
};

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["CODESKUL", "ISRO"],
    flightNumber: newFlightNumber,
  };
  await saveLaunch(newLaunch);
};

const existsLaunchWithId = async (launchId) => {
  return await launchesDatabase.findOne({ flightNumber: launchId });
};

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
};

module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
