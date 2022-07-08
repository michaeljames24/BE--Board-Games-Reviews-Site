const app = require("./app");
const { PORT = 9090 } = process.env;
const db = require('../db/connection');

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`listening on ${PORT}...`);
})