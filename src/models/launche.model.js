const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
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
    ...launch,
    flightNumber: latestFlightNumber,
    customer: ["CODESKUL", "ISRO"],
    upcoming: true,
    success: true,
  });
};

module.exports = {
  getAllLaunches,
  addNewLaunch
};
