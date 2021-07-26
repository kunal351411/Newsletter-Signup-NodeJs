const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function (req,res)
{
  res.sendFile(__dirname + "/signup.html");
});


app.post("/",function (req,res)
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data ={
      members : [
        {
        email_address : email,
        status :  "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/5230c26b1f";

    const options = {
      method : "POST",
      auth : "Kunal:ebe89a36adc43203cc5180efbd545517-us6"
    }

    const request = https.request(url,options,function (response)
    {
        response.on("data",function (data)
      {
        const parsedData = JSON.parse(data);
        if(parsedData.error_count === 0)
        {
          res.sendFile(__dirname + "/success.html");
        }
        else
        {
          res.sendFile(__dirname + "/failure.html");
        }
      });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure",function (req,res)
{
  res.redirect("/");
});




app.listen(process.env.PORT || 3000,function ()
{
  console.log("Server started at port 3000");
});




//API Key
//ebe89a36adc43203cc5180efbd545517-us6

//List id
//5230c26b1f
