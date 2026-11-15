const express = require('express')
const router = express.Router();
const {AuthToken} = require("../middleware/Auth")
const Note = require("../controller/Note")

router.post("/moodtracker", AuthToken, Note.Memo);
router.get("/moodmemo", AuthToken, Note.GetNote);  // Getnote -> GetNote
router.get("/moodStat", AuthToken, Note.StaticMonth);
router.get("/weekStat", AuthToken, Note.StaticWeek);
router.get("/lesson", AuthToken, Note.GetLesson);
router.get("/score", AuthToken, Note.GetScore);
router.get("/topmood", AuthToken, Note.TopMood);
router.get("/praise", AuthToken, Note.GetPraise);
router.get("/moodtrend", AuthToken, Note.MoodTrend);
router.get("/monthmoods", AuthToken, Note.GetMonthMoods);

module.exports = router;