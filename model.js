const { Schema, Model, default: mongoose } = require("mongoose");

const user = new Schema({
    StudentName: {
        type: String,
        maxlength: 30,
    },
    CollegeName: {
        type: String,
        maxlength: 30,
    },
    Round1Marks: {
        type: Number,
        max: 10,
        min: 0,
    },
    Round2Marks: {
        type: Number,
        max: 10,
        min: 0,
    },
    Round3Marks: {
        type: Number,
        max: 10,
        min: 0,
    },
    TechnicalRoundMarks: {
        type: Number,
        max: 20,
        min: 0,
    },
});

user.virtual("TotalMarks").get(function () {
    return (
        this.Round1Marks +
        this.Round2Marks +
        this.Round3Marks +
        this.TechnicalRoundMarks
    );
});

user.virtual("result").get(function () {
    return this.TotalMarks < 35 ? "Rejected" : "Selected";
});

user.virtual("Rank").get(function () {
    return this._Rank;
});

user.set("toJSON", { virtuals: true });
user.set("toObject", { virtuals: true });

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
