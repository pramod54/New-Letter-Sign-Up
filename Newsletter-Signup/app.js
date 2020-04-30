const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//get means we are sending info or data to site
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

//post means information we are fetching from site
app.post("/", function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const mail = req.body.email;
  console.log(firstName,lastName,mail);

  var data={
    members: [
      {
        email_address:mail,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/6cf44e7bf9";
  const options = {
    method: "POST",
    auth: "prince:039c9cb9d6deff704de6f66a168cced3-us8"
  }
  const request = https.request(url,options,function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})



 app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
})
