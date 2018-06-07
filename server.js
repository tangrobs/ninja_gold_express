const express = require('express')
const app = express()
const body_parser = require("body-parser")
const session = require("express-session")
const path = require("path")
app.use(body_parser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "./static")))

app.set("views", path.join(__dirname, "./views"))
app.set("view engine","ejs")

app.use(session({
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie: {maxAge:60000}
}))

app.get("/", function(req, res){
    if(!req.session.gold || !req.session.activities){
        req.session.gold = 0;
        req.session.activities = []
    }
    res.render("index", {gold:req.session.gold, activities:req.session.activities})
})

app.post("/process_money",function(req, res){
    let building = req.body.area
    if(building == "farm"){
        let goldmade = getRndInteger(10,20)
        req.session.gold += goldmade
        req.session.activities.push(["won","Earned " + goldmade + " at the farm"])
    }
    else if(building == "cave"){
        let goldmade = getRndInteger(5,10)
        req.session.gold += goldmade
        req.session.activities.push(["won","Earned " + goldmade + " gold at the cave"])
    }
    else if(building == "house"){
        let goldmade = getRndInteger(2,5)
        req.session.gold += goldmade
        req.session.activities.push(["won","Earned " + goldmade + " gold at the house"])
    }
    else if(building == "casino"){
        let goldmade = getRndInteger(-50,50)
        req.session.gold += goldmade
        if(goldmade >= 0){
            req.session.activities.push(["won","Entered a casino and won " + goldmade + " gold. Yay!"])
        }
        else{
            req.session.activities.push(["lost","Entered a casino and lost " + (-1*goldmade) + " gold... ouch..."])
        }
    }
    res.redirect('/')
})

app.listen(8000, function(){
    console.log("breakdancing on port 8000");
})


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
