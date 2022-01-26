const functions = require("firebase-functions");
const admin = require("firebase-admin");
const log_app = admin.initializeApp(
  {
    databaseURL: "https://glo3d-logs.firebaseio.com",
  },
  "log_app"
);
const log_db = log_app.database();
const fs = require("fs");
exports.script = functions.https.onRequest(async (req, res) => {
  if (!req.headers.referer) {
    res.type(".txt").status(200).send("cannot call directly");
    return;
  }
  console.log("referer:", req.headers.referer);
  let { hostname } = new URL(req.headers.referer);
  let tmp = hostname.split(".");
  let site = "";
  if (tmp.length == 3) {
    site = tmp[1];
  } else {
    site = tmp[0];
  }
  try {
    let old_counter = (await log_db.ref("gScriptUsage").child(site).child("counter").once("value")).val() ?? 0;
    await log_db.ref("gScriptUsage").child(site).update({
        counter: old_counter + 1
    })
  } catch (e) {
    console.log(e);
  }
  let baseScript = fs.readFileSync("./integrations/base.js", "utf8");
  if (fs.existsSync("./integrations/" + site + ".js")) {
    console.log(909, "./integrations/" + site + ".js");
    let myScript = fs.readFileSync("./integrations/" + site + ".js", "utf8");
    res
      .type(".js")
      .status(200)
      .send(baseScript + "\r\n" + myScript);
  } else {
    res
      .type(".txt")
      .status(200)
      .send("not supported on " + site);
  }
});
