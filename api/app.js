require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

const traineeRoutes = require("./routes/traineeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.on("connection", socket => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/admin", adminRoutes);
app.use("/api/trainee", traineeRoutes);

const { getAllUsers } = require("./controllers/traineeController");
app.get("/tu", getAllUsers);

app.all("*a", (req, res) => {
    return res.status(404).json({ msg: "Unsupported Route" });
});

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected ✔");
        server.listen(process.env.PORT, () => {
            console.log(`API is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Error from mongoose --> ${err.message}`);
    });