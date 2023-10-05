const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["PSTECH", "ISRO"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Array.from(launches.values());
};

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    flightNumber: latestFlightNumber,
    ...launch,
    customer: ["CODESKUL", "ISRO"],
    upcoming: true,
    success: true,
  });
};

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId);
};

const abortLaunchById = (launchId) => {
  // permenantly remove record
  // launches.delete(launchId);

  // Soft Delete
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
};

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
