const express = require('express');
const app = express();
const Routes = require('./routes/routes')
require('./database/database')


app.use(express.json());
app.use(Routes);

app.listen(5000,()=>{
    console.log("server lister port 5000")
})