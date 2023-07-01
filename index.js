const express = require("express");

const PORT = "40281"

const app = express();
const blogDir = process.env.BLOGDIR;
console.log("blogDir: ", blogDir);
console.log("www dir: ", process.env.WWWDIR);

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

app.listen(PORT);
