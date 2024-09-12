require("dotenv").config();
const mongoose = require("mongoose");
const users = require("./model");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

mongoose
    .connect(process.env.uri)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("err: ", err));

app.use(bodyParser.json());

app.post("/users", async (req, res) => {
    try {
        const {
            StudentName,
            CollegeName,
            Round1Marks,
            Round2Marks,
            Round3Marks,
            TechnicalRoundMarks,
        } = req.body;
        const newuser = new users({
            StudentName,
            CollegeName,
            Round1Marks,
            Round2Marks,
            Round3Marks,
            TechnicalRoundMarks,
        });
        await newuser.save();
        res.status(201).json(newuser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/users/calculateRanks", async (req, res) => {
    try {
        const user = await users.find().sort({ TotalMarks: -1 }).exec();
        let rank = 1;
        user.forEach((u, index) => {
            if (index > 0 && u.TotalMarks < user[index - 1].TotalMarks) {
                rank = index + 1;
            }
            u.Rank = rank;
        });
        await Promise.all(user.map((u) => u.save()));
        res.status(200).json({ message: "Ranks updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/users", async (req, res) => {
    try {
        const user = await users.find().sort({ TotalMarks: -1 }).exec();
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log("server running");
});
