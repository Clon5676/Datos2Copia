//main definido en el package.json

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Add this line
app.use(express.json());
app.use(cors());

const db = require("./models");

//ROUTERS
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const daresRouter = require("./routes/Dares");
app.use("/dares", daresRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const ratingsRouter = require("./routes/Ratings");
app.use("/ratings", ratingsRouter);

const tagsRouter = require("./routes/Tags");
app.use("/tags", tagsRouter);

db.sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("server corriendo en puerto 5000");
  });
});
