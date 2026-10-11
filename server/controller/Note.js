const { measureMemory } = require("node:vm");
const Note = require("../Module/Note");
const { error } = require("node:console");
const { constants } = require("node:buffer");
const { notEqual } = require("node:assert");
const { format } = require("node:path");
const multer = require('multer');
const path = require('path');

exports.Memo = async (req, res) => {
    try {
        console.log("memo function");
        console.log(req.headers);
        console.log(req.body);
        const { date, mood, description, praise, learn } = req.body;
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
    
        let formattedDate = date;
        if (date && date.includes("T")) {
            formattedDate = date.split("T")[0];
        }

        
        if(day < today){
            return res.status(200).json({message : " You don't submit this day"})
            console.log("เลยวันที่บันทึก")
        }
 
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const note = await Note.findOne({
            userId: req.user.id,
            createdAt: { 
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        
        if (note) {
            return res.status(200).json({ error: "you already save" });
        }

        if (!mood) {
            return res.status(400).json({ error: "please select mood" });
        }

        const NewNote = new Note({
            userId: userId,
            date: formattedDate,
            mood: mood,
            describe: description,
            praise: praise,
            learn: learn
        });

        await NewNote.save();
        return res.status(200).json({ message: "successed!!" ,
            note:NewNote
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Cannot save note" });
    }
};


exports.StaticMonth = async (req, res) => {
    try {
        console.log("static month")
        const currentMonth = new Date().getMonth() + 1; 
        const userId = req.user.id;
        const MoodStatic = await Note.aggregate([
            {
                $match: { 
                    userId: userId,
                    $expr: { $eq: [{ $month: "$date" }, currentMonth] } 
                }
            },
            {
                $group: { 
                    _id: "$mood",
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json(MoodStatic);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Static error" });
    }
};
// controllers/note.js

exports.StaticWeek = async (req, res) => {

    try {
        console.log("static week");
        const id = req.user.id;
        const today = new Date();
        const firstDay = new Date(today);
        const currentDay = new Date().getDay(); 
        const diff = currentDay === 0 ? 6 : currentDay - 1;

        firstDay.setDate(
            today.getDate() - diff
        );

        const stat = await Note.find(
            {
                userId: id,
                date: {
                    $gte: firstDay,
                    $lte: today
                }
            },
            "score date mood"
        );
        res.status(200).json(stat);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Cannot get week stat"
        });
    }
}

exports.GetNote = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        const date = req.query.date;
        console.log(date);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const note = await Note.findOne({
            userId: id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (note) {
            return res.status(200).json({ success: true, note: note });
            console.log(note.mood);
        }
        return res.status(200).json({ success: false, message: "you don't record" });    

    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

exports.GetLesson = async (req, res) => {
    try {
        console.log("getlesson");
        const userId = req.user.id;
        const date = new Date();
        const startOfDay = new Date(date.getFullYear(),date.getMonth(),1);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date.getFullYear(),date.getMonth()+1,0);
        endOfDay.setHours(23, 59, 59, 999);

        const note = await Note.find({
            userId: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        },{ learn: 1, _id: 0 });

        const formattdata = note.map((item) =>{
            return item.learn;
        })

        console.log(formattdata);
        return res.status(200).json(formattdata);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Cannot get lessons" });
    }
};


exports.GetPraise = async (req, res) => {
    try {
        console.log("getpraise");
        const userId = req.user.id;
        const date = new Date();
        const startOfDay = new Date(date.getFullYear(),date.getMonth(),1);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date.getFullYear(),date.getMonth()+1,0);
        endOfDay.setHours(23, 59, 59, 999);

        const note = await Note.find({
            userId: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        },{ praise: 1, _id: 0 });

        const formattdata = note.map((item) =>{
            return item.praise;
        })

        console.log(formattdata);
        return res.status(200).json(formattdata);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

exports.GetScore = async (req, res) => {
    try {
        console.log("getscore");

        const userId = req.user.id;
        const date = new Date();
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);


        const startOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        startOfLastMonth.setHours(0, 0, 0, 0);

        const endOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        endOfLastMonth.setHours(23, 59, 59, 999);

        const [currentMonthResult, lastMonthResult] = await Promise.all([

            Note.aggregate([
                {
                    $match: { 
                        userId: userId,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: { 
                        _id: null, 
                        totalScore: { $avg: "$score" }, 
                        totalDay: { $sum: 1 }
                    }
                }
            ]),

            Note.aggregate([
                {
                    $match: { 
                        userId: userId,
                        date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                    }
                },
                {
                    $group: { 
                        _id: null, 
                        totalScore: { $avg: "$score" },
                        totalDay: { $sum: 1 } 
                    }
                }
            ])
        ]);

        const defaultData = { totalScore: 0, totalDay: 0 };

        return res.status(200).json({
            month: currentMonthResult[0] || defaultData,
            lastmonth: lastMonthResult[0] || defaultData
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

exports.TopMood = async (req, res) => {
    try {
        console.log("topmood");
        const currentMonth = new Date().getMonth() + 1
        const userId = req.user.id;
        const result = await Note.aggregate([
            {
                $match: { 
                    userId: userId,
                    $expr: { $eq: [{ $month: "$date" }, currentMonth] }
                }
            },
            {
                $group: { 
                    _id: "$mood",
                    count: { $sum: 1 }
                    }
            },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        return res.status(200).json(result[0]); 
    } catch (err) {
        consloe.log(err);
        res.status(500).json({ error: err.message });
    }
}

exports.MoodTrend = async (req,res) =>{
    try{
        
        console.log("mood trend");
        const userId = req.user.id;
        const date = new Date();
        const startOfDay = new Date(date.getFullYear(),date.getMonth(),1);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date.getFullYear(),date.getMonth()+1,0);
        endOfDay.setHours(23, 59, 59, 999);

        const moodtrend = await Note.find({ 
            userId: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }, {score:1,date:1,mood:1,_id:0});

        if(!moodtrend){
            res.status(400).json({ error: "No data found" });
        }
        res.status(200).json(moodtrend)

    }catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

exports.uploadProfile = async (req,res) =>{

}
