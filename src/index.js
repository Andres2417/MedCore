const express = require('express')
const database = require("./config/database")
const routes = require("./router/routes")
const bodyparser = require("body-parser")

require("dotenv").config();

const app = express();
//middleware: POST, PUT, PATCH
app.use(bodyparser.json());
app.use('/api/v1/', routes)

app.listen(process.env.PORT, () =>{
    console.log(`Server running on port: ${process.env.PORT}`);
    database();
});
