const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const NoteRoute = require('./Route/Note');
const AuthRoute = require('./Route/Auth');
const ChatRoute = require('./Route/Chat')

console.log("before conect db")
connectDB();

app.use(cors({
  origin: ['http://localhost:3000','http://192.168.1.59:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ["Content-Type", "authorization", "id","token"],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

app.use("/api/auth",AuthRoute);
app.use("/api/note",NoteRoute);
app.use("/api/chat",ChatRoute);

// dont forget to note what they do
app.get('/', (req, res) => {
    res.send("Server is ready");
});

app.listen(5000, () => console.log("Server is running on port 5000"));
