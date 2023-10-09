const { default: axios } = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const debug = require("debug")("nasa-api:model/launches");

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

const DEFAULT_FLIGHT_NUMBER = 100;

const populateLaunches = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
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

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customers,
    };

    saveLaunch(launch);
  }

  /** TODO:Populate launches collection */
};

const loadLaunchesData = async () => {
  debug("Downloading Space-X launches data...");

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    debug("Launch data already exist");
  } else {
    populateLaunches();
  }
};

const findLaunch = async (filter) => {
  return await launchesDatabase.findOne(filter);
};

const getAllLaunches = async (skip, limit) => {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const saveLaunch = async (launch) => {
  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
};

const getLatestFlightNumber = async () => {
  const latestFlight = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestFlight) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestFlight.flightNumber;
};

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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
  return await findLaunch({ flightNumber: launchId });
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
