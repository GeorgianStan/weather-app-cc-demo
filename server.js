//Install express server
const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT || 8080;
const currentApp = "unfinished";

// Serve only the static files form the dist directory
app.use(express.static(__dirname + `/${currentApp}/static`));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + `/${currentApp}/static/index.html`));
});

// Start the app by listening on the default Heroku port
app.listen(port, () => {
  console.log(
    `Running the ${currentApp} version of the application at port ${port}`
  );
});
