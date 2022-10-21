const fs = require("fs");
const express = require("express");

const app = express();
const filename = "book-data.json";

app.set("view engine", "pug");
app.set("views", "./views");

app.all("/", function (req, res) {
  res.send(
    "<h1> Go to routes /write, /read, /update and /delete to perform respective action </h1>"
  );
});

app.get("/write", function (req, res) {
  const obj = {
    name: "Fire and Blood",
    author: "George R. R. Martin",
    genre: "Fantasy",
    rating: 4,
    sales: 700,
  };

  fs.writeFile(filename, JSON.stringify(obj), (err) => {
    if (err) throw err;
    res.send("Successfully written to file");
  });
});

app.get("/write/:name/:author/:genre/:rating/:sales", function (req, res) {
  const obj = req.params;
  obj.sales = +obj.sales;

  fs.writeFile(filename, JSON.stringify(obj), (err) => {
    if (err) throw err;
    res.send("Successfully written to file");
  });
});

app.get("/read", function (req, res) {
  fs.readFile(filename, "utf-8", function (err, data) {
    if (err) throw err;

    const obj = JSON.parse(data);
    res.render("dataView", obj);
  });
});

app.use("/update", function (req, res, next) {
  fs.readFile(filename, "utf-8", function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);
    req.data = obj;

    console.log("Middleware reading data for update...");
    next();
  });
});

app.get("/update", function (req, res) {
  const obj = req.data;
  console.log(obj);
  obj.sales += 3;

  fs.writeFile(filename, JSON.stringify(obj), function (err) {
    if (err) throw err;
    res.send("File successfully updated");
  });
});

app.get("/delete", function (req, res, next) {
  fs.unlink(filename, (err) => {
    if (err) next(err);
    res.send("File successfully deleted");
  });
});

app.all("*", function (req, res) {
  res.status(404).send("Sorry, the requested URL is not found.");
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

app.listen(5000);
