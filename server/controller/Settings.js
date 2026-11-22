const User = require('../Module/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// PUT /auth/profile   body: { name }
exports.UpdateProfile = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'Please enter a name' });
    }

    // Login ใช้ name ค้นหา user จึงห้ามซ้ำกับคนอื่น
    const taken = await User.findOne({ name, _id: { $ne: req.user.id } });
    if (taken) {
      return res.status(400).json({ error: 'This name is already taken' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // payload ของ token มี name อยู่ จึงออก token ใหม่ให้ตรงกับชื่อใหม่
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(200).json({ message: 'Profile updated', name: user.name, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// PUT /auth/password   body: { currentPassword, newPassword }
exports.ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please enter all information' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is wrong' });
    }

    // เหมือนตอน Regis: ส่ง plain password ให้ model hash ให้ตอน save
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};