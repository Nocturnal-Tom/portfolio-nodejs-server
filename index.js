const express = require("express");

const PORT = "40281"

const app = express();


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
