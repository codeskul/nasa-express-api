const request = require("supertest");

const app = require("../../app");

/** GET /launches */
describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    /** Method 1 */
    // const response = await request(app).get("/launches");
    // expect(response.statusCode).toBe(200);

    /** Method 2 */
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

/** POST /launches */
describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "Aditya L1",
    rocket: "GSLV Mark 2",
    target: "Sun",
    launchDate: "January 4, 2028",
  };

  const launchDataWithoutDate = {
    mission: "Aditya L1",
    rocket: "GSLV Mark 2",
    target: "Sun",
  };

  const launchDataWithInvalidDate = {
    mission: "Aditya L1",
    rocket: "GSLV Mark 2",
    target: "Sun",
    launchDate: "Invalid Date",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    /** Date comparision seperately */
    const requestDate = new Date(completeLaunchData.launchDate).valueOf(); // return timestamp
    const responseDate = new Date(response.body.launchDate).valueOf(); // return timestamp
    expect(responseDate).toBe(requestDate);

    /** Another data without date comparision seperately */
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Invalid launch date" });
  });
});

/** DELETE /launches/:id */
describe("Test DELETE /launches/:id", () => {
  test("It should respond with 200 success", async () => {
    const launchId = 100;
    const response = await request(app)
      .delete(`/launches/${launchId}`)
      .expect(200);
  });

  test("It should catch Launch not found", async () => {
    const launchId = 1; // which is not exist in launches
    const response = await request(app).delete(`/launches/${launchId}`).expect(404);

    expect(response.body).toStrictEqual({
      error: "Launch not found",
    });
  });
});
