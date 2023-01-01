const cheerio = require("cheerio")
const express = require("express")
const axios = require("axios")
const bp = require("body-parser")
const cors = require("cors")
let app = express()
let thisUsage = 0
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));
app.use(bp.json())
app.post('/register',(req,res) => {
  thisUsage += 1
  console.log(thisUsage)
    let body = req.body
    let resellerDomain =  req.body.resellerDomain || "byethost11.com"
    console.log(body)
 
    var qs = require('qs');
    var data = qs.stringify({
      'email': body.clientEmail,
      'username': body.clientDomain,
      'password': body.clientPassword,
      'PlanName': body.clientPlan || "Starter",
      'number': body.code || '61499' 
    });
    var config = {
      method: 'post',
      url: 'https://ifastnet.com/register2.php',
      headers: { 
        'Referer': "https://" + resellerDomain + "/", 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'PHPSESSID=kd21fl4v5p7tpf0pl9t8gvko74'
      },
      data : data
    }
    axios(config).then((response) => {
        console.log("Responsed")
        var page = cheerio.load(response.data)
        page("style").remove()
        page("link").remove()
        page("head").remove()
        
        res.json({
            message: page("body").text(),
            usages: thisUsage
        })
    }).catch((err) => {
        res.json({
            message: "error",
           usages: thisUsage
        })
    })
})

app.get('/',(req,res) => {
  res.json({
    message: "Home Page",
    pages: [
      {
        title: "SimpleRegister API ( /register )",
        description: "JSON with clientEmail,clientPassword,clientDomain,clientPlan (Optional) code(Optional)"
      }
    ]
  })
})
app.listen(80)