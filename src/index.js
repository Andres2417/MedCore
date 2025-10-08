require("dotenv").config();
const express = require('express')
const database = require("./config/database")
const routes = require("./router/routes")
const bodyparser = require("body-parser")
const cors = require("cors")


const app = express();
//Middleware CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
//middleware: POST, PUT, PATCH
app.use(bodyparser.json());
app.use('/api/v1/', routes)

app.listen(process.env.PORT, () =>{
    console.log(`Server running on port: ${process.env.PORT}`);
    database();
});
