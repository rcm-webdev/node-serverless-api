const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");

const app = express();

const dbClient = async () => {
  //this is for http connections and non-pooling 
  //no pooling in a serverless environment
  neonConfig.fetchConnectionCache = true;
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const results = await sql`SELECT now()`
  return res.status(200).json({
    message: "Hello from root!",
    results: results,
    database_url: process.env.DATABASE_URL,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

//this is for a serverful application
// app.listen(2121, () => {
//   console.log("Server is running on port 2121");
// });

exports.handler = serverless(app);
