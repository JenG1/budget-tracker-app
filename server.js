const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = process.env.MONGODB_URI || "expensetracker";
const collections = ["expenses"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);

  db.expenses.insert(req.body, (error, saved) => {
    if (error) {
      console.log(error);
    } else {
      res.send(saved);
    }
  });
});

app.get("/all", (req, res) => {
  db.expenses.find({}, (error, found) => {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
});

app.get("/find/:id", (req, res) => {
  db.expenses.findOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    (error, found) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(found);
        res.send(found);
      }
    }
  );
});

app.post("/update/:id", (req, res) => {
  db.expenses.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        title: req.body.title,
        expense: req.body.expense,
        modified: Date.now()
      }
    },
    (error, edited) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.expenses.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    (error, removed) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

app.delete("/clearall", (req, res) => {
  db.expenses.remove({}, (error, response) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(response);
      res.send(response);
    }
  });
});

const PORT = process.env.PORT || 8060;

app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`);
});
