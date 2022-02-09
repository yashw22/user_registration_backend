const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();
const app = express();

app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: "session",
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);

const db = require("./app/models");
const Role = db.role;
db.mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            console.log("First conncetion to db, adding roles.");
            new Role({ name: "user" }).save(err => {
                if (err) console.log("error", err);
                console.log("Added 'user' to roles collection");
            });
            new Role({ name: "moderator" }).save(err => {
                if (err) console.log("error", err);
                console.log("Added 'moderator' to roles collection");
            });
            new Role({ name: "admin" }).save(err => {
                if (err) console.log("error", err);
                console.log("Added 'admin' to roles collection");
            });
        }
    });
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});