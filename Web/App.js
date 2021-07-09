const express = require("express");
const path = require("path");
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "replace-with-your-client-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL:
    "https://your-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
firebase.initializeApp(firebaseConfig);

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const verifyUser = (req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user) {
    next();
  } else {
    res.redirect("/sign-in");
  }
};

app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

app.post("/sign-in", (req, res) => {
  const { email, password } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (result) {
      console.log("success");
      res.redirect("/");
    })
    .catch(function (error) {
      console.log("failed");
      console.log(error);
      res.redirect("/sign-in");
    });
});

app.get("/", verifyUser, (req, res) => {
  res.render("home");
});

app.use((req, res) => {
  // Create 404 page
  res.status(404).send("NOT FOUND");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
