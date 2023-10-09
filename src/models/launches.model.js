const { default: axios } = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const debug = require("debug")("nasa-api:model/launches");

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, // flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), // date_local
  target: "Kepler-442 b", //
  customers: ["PSTECH", "ISRO"], // payloads.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

const loadLaunchesData = async () => {
  debug("Downloading spacex data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  
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
  loadLaunchesData,
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
