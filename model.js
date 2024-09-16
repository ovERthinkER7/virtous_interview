const { Schema, Model, default: mongoose } = require("mongoose");
const roundmax = 10;
const trroundmax = 20;
const user = new Schema({
    StudentName: {
        type: String,
        maxlength: 30,
    },
    CollegeName: {
        type: String,
        maxlength: 50,
    },
    Round1Marks: {
        type: Number,
        max: roundmax,
        min: 0,
    },
    Round2Marks: {
        type: Number,
        max: roundmax,
        min: 0,
    },
    Round3Marks: {
        type: Number,
        max: roundmax,
        min: 0,
    },
    TechnicalRoundMarks: {
        type: Number,
        max: trroundmax,
        min: 0,
    },
    TotalMarks: {
        type: Number,
        default: function () {
            return (
                this.Round1Marks +
                this.Round2Marks +
                this.Round3Marks +
                this.TechnicalRoundMarks
            );
        },
    },
    Result: {
        type: String,
        default: function () {
            return this.TotalMarks >= 35 &&
                this.Round1Marks >= roundmax * 0.7 &&
                this.Round2Marks >= roundmax * 0.7 &&
                this.Round3Marks >= roundmax * 0.7 &&
                this.TechnicalRoundMarks >= trroundmax * 0.7
                ? "Selected"
                : "Rejected";
        },
    },
    Rank: {
        type: Number,
        default: null,
    },
});

user.statics.calculateRanks = async function () {
    const users = await this.find().sort({ TotalMarks: -1 }).exec();
    let rank = 1;
    users.forEach((u, index) => {
        if (index > 0 && u.TotalMarks < users[index - 1].TotalMarks) {
            rank = index + 1;
        }
        u._Rank = rank;
    });
    await Promise.all(users.map((u) => u.save()));
};

const userschema = mongoose.model("user", user);

module.exports = userschema;
