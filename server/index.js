require("dotenv").config();
const express=require("express");
const router=require("./routes/main");
const app=express();
const port=125;
const cors=require('cors');
const expressLayouts = require('express-ejs-layouts');



app.use(express.json());
app.use(cors());
app.use(router);


app.use(express.static('./assets'));


app.use(expressLayouts);


// extract style and scripts from subpages into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './view');



app.listen(port,function (error){
    if(error){
        console.log("error");
    }
    console.log(`app running ${port}`);
})