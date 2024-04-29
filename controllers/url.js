let nanoid;
import("nanoid").then((module) => {
  nanoid = module.nanoid;
});
const Url = require("../models/url.model");

exports.GenerateNewShortURL = async (req, res) => {
  const { originalURL } = req.body;
  if (!originalURL) {
    throw new Error("URL is required");
  }
  const shortID = nanoid(8);
  await Url.create({ shortID, redirectURL: originalURL });
  res.status(201).render("index", { shortID });
};

exports.getRedirectURL = async (req, res) => {
  const { shortID } = req.params;
  if (!shortID) {
    throw new Error("Short URL is required");
  }

  const url = await Url.findOne({ shortID });
  if (!url) {
    throw new Error("Short URL not found");
  }

  const clientIP = req.ip || req.connection.remoteAddress;
  await Url.updateOne(
    { shortID },
    { $push: { visitHistory: { IP: clientIP, timestamp: new Date() } } }
  );
  res.redirect(url.redirectURL);
};

exports.getAnalytics = async (req, res) => {
  const { shortID } = req.params;
  if (!shortID) {
    throw new Error("Short URL is required");
  }
  const url = await Url.findOne({ shortID });
  if (!url) {
    throw new Error("Short URL not found");
  }
  res.status(200).render("analytics", { url });
};
