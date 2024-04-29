require("express-async-errors");
require("dotenv").config();
require("./config")();
const express = require("express");
const app = express();
const errorHandler = require("./errorHandler");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { shortID: "" });
});

const urlRoutes = require("./routes/url");
app.use("/url", urlRoutes);

const { getRedirectURL } = require("./controllers/url");
app.get("/:shortID", getRedirectURL);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Resource not found",
  });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
