const express = require("express");
const fs = require("fs");

const PORT = "40281"

const app = express();
const blogDir = process.env.BLOGDIR;
console.log("blogDir: ", blogDir);
console.log("www dir: ", process.env.WWWDIR);


app.use(express.json({type: "text/plain"}));

app.get("/api/blog*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify({
        blogs: [
            {
                title: "My first blog post!",
                description: "I'm testing my blog capabilities!!!",
                content: "<h1> WOOHOO </h1>"
            }
        ]
    }));
})

app.post("/api/contactForm", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req.body);
	fs.appendFile("contacts.txt", JSON.stringify(req.body).concat("\n"), (err) => {});
	res.send("");
});

app.listen(PORT);
