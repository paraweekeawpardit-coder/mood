const Note = require('../Module/Note');

exports.Memo = async (req, res) => {
  try {
    const { date, mood, description, praise, learn } = req.body;
    const userId = req.user.id;

    if (!mood) {
      return res.status(400).json({ error: 'please select mood' });
    }

    let formattedDate = date;
    if (typeof date === 'string' && date.includes('T')) {
      formattedDate = date.split('T')[0];
    } else if (!formattedDate) {
      const now = new Date();
      formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    const [y, m, d] = formattedDate.split('-').map(Number);
    const targetDay = new Date(y, m - 1, d);
    targetDay.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDay < today) {
      return res.status(200).json({ error: 'You cannot submit for past days' });
    }

    const startOfDay = new Date(`${formattedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${formattedDate}T23:59:59.999Z`);

    const note = await Note.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (note) {
      return res.status(200).json({ error: 'you already save' });
    }

    const NewNote = new Note({
      userId,
      date: startOfDay,
      mood,
      describe: description?.trim() || 'not have',
      praise: praise?.trim() || 'not have',
      learn: learn?.trim() || 'not have'
    });

    await NewNote.save();
    return res.status(200).json({
      message: 'successed!!',
      note: NewNote
    });
  } catch (err) {
    console.log('Memo Error:', err);
    return res.status(500).json({ error: 'Cannot save note' });
  }
};

exports.StaticMonth = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const userId = req.user.id;
    const MoodStatic = await Note.aggregate([
      {
        $match: {
          userId,
          $expr: { $eq: [{ $month: '$date' }, currentMonth] }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json(MoodStatic);
  } catch (err) {
    console.log('StaticMonth Error:', err);
    return res.status(500).json({ error: 'Static error' });
  }
};

exports.StaticWeek = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = req.user.id;
    const now = new Date();

    const sun = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    sun.setHours(0, 0, 0, 0);

    const sat = new Date(sun);
    sat.setDate(sun.getDate() + 6);
    sat.setHours(23, 59, 59, 999);

    const stat = await Note.find(
      {
        userId: id,
        date: {
          $gte: sun,
          $lte: sat
        }
      },
      'score date mood'
    );
    return res.status(200).json(stat);
  } catch (err) {
    console.log('StaticWeek Error:', err);
    return res.status(500).json({
      error: 'Cannot get week stat'
    });
  }
};

exports.GetNote = async (req, res) => {
  try {
    const id = req.user.id;
    const date = req.query.date;

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const note = await Note.findOne({
      userId: id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (note) {
      return res.status(200).json({ success: true, note });
    }
    return res.status(200).json({ success: false, message: "you don't record" });
  } catch (err) {
    console.log('GetNote Error:', err);
    return res.status(500).json({ error: 'Cannot get note' });
  }
};

exports.GetLesson = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const note = await Note.find(
      {
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      },
      { learn: 1, _id: 0 }
    );

    const formattdata = note
      .map((item) => item.learn)
      .filter((val) => val && val !== 'not have');

    return res.status(200).json(formattdata);
  } catch (err) {
    console.log('GetLesson Error:', err);
    return res.status(500).json({ error: 'Cannot get lessons' });
  }
};

exports.GetPraise = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const note = await Note.find(
      {
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      },
      { praise: 1, _id: 0 }
    );

    const formattdata = note
      .map((item) => item.praise)
      .filter((val) => val && val !== 'not have');

    return res.status(200).json(formattdata);
  } catch (err) {
    console.log('GetPraise Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.GetScore = async (req, res) => {
  try {
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
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalScore: { $avg: '$score' },
            totalDay: { $sum: 1 }
          }
        }
      ]),
      Note.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalScore: { $avg: '$score' },
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
    console.log('GetScore Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.TopMood = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const userId = req.user.id;
    const result = await Note.aggregate([
      {
        $match: {
          userId,
          $expr: { $eq: [{ $month: '$date' }, currentMonth] }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    return res.status(200).json(result[0] || null);
  } catch (err) {
    console.log('TopMood Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.MoodTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const moodtrend = await Note.find(
      {
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      },
      { score: 1, date: 1, mood: 1, _id: 0 }
    ).sort({ date: 1 });

    return res.status(200).json(moodtrend);
  } catch (err) {
    console.log('MoodTrend Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.GetMonthMoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = req.query.month !== undefined ? parseInt(req.query.month) : new Date().getMonth();

    const startOfMonth = new Date(year, month, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(year, month + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const notes = await Note.find(
      {
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      },
      { date: 1, mood: 1, _id: 0 }
    );

    return res.status(200).json(notes);
  } catch (err) {
    console.log('GetMonthMoods Error:', err);
    return res.status(500).json({ error: 'Cannot get month moods' });
  }
};