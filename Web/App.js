const express = require("express");
const path = require("path");
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyBx5kVvwtZjbmMPOoUar41osC2ulEgdNAo",
  authDomain: "bise-1e483.firebaseapp.com",
  databaseURL:
    "https://bise-1e483-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bise-1e483",
  storageBucket: "bise-1e483.appspot.com",
  messagingSenderId: "430858535613",
  appId: "1:430858535613:web:a6d47de497ec856c6f6dd4",
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
