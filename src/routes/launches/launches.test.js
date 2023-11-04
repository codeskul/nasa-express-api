const request = require("supertest");

const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async()=>{
    await mongoDisconnect()
  })

  /** GET /launches */
  describe("Test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      /** Method 1 */
      // const response = await request(app).get("/v1/launches");
      // expect(response.statusCode).toBe(200);

      /** Method 2 */
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  /** POST /launches */
  describe("Test POST /v1/launches", () => {
    const completeLaunchData = {
      mission: "Aditya L1",
      rocket: "GSLV Mark 2",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "Aditya L1",
      rocket: "GSLV Mark 2",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "Aditya L1",
      rocket: "GSLV Mark 2",
      target: "Kepler-62 f",
      launchDate: "Invalid Date",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
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
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });

  /** DELETE /launches/:id */
  describe("Test DELETE /v1/launches/:id", () => {
    test("It should respond with 200 success", async () => {
      const launchId = 103;
      const response = await request(app)
        .delete(`/v1/launches/${launchId}`)
        .expect(200);
    });

    test("It should catch Launch not found", async () => {
      const launchId = 0; // which is not exist in launches
      const response = await request(app)
        .delete(`/v1/launches/${launchId}`)
        .expect(404);

      expect(response.body).toStrictEqual({
        error: "Launch not found",
      });
    });
  });
});
