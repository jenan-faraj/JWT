//-----------------------
// imports
//-----------------------
const express = require("express");
const jwt = require("jsonwebtoken"); //لانشاء ال token
const cookieParser = require("cookie-parser"); // لارسال ال token من خلالها
const bodyParser = require("body-parser"); //لتحويل الداتا الي رح تيجي من الفرونت من json ل parse
const cors = require("cors"); // لربط الباك مع الفرونت

const app = express();
const PORT = 9000;

//-----------------------
// middlewares
//-----------------------

app.use(cors({ origin: "http://localhost:5174", credentials: true })); //credentials لما تكون true بتسمحلنا نرسل ونستقبل ال cookie  //الكود المسؤول عن ربط الفرونت في الباك
app.use(bodyParser.json()); //لتحويل الداتا الي رح تيجي من الفرونت من json ل parse
app.use(cookieParser());

const users = []; // لتخزين الداتا تاعت اليوزر

const authenticateToken = (req, res, next) => {
  //للتاكد من وجود token
  const token = req.cookies.token; // للوصول لل token
  if (!token) return res.sendStatus(401); // اذا ال token مش موجود رجع ايرور 401

  jwt.verify(token, "secretKey", (err, user) => {
    // اذا موجود ال token اتاكدلي منو
    if (err) return res.sendStatus(403); // اذا فيه ايرور رجع ايرور 403
    req.user = user; // اذا مافي خزن اليوزر في req.user
    next(); // عشان نخليه ينتقل ع meddleware الي بعدها
  });
};

//-----------------------
// Sign up
//-----------------------

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body; // ليجيب الداتا الي رح يعبيها اليوزر
  const user = { name, email, password }; // خزننا الداتا بمتغير
  users.push(user); // اعملنا بوش للداتا ع ال array
  console.log("Users:", users); // منطبع الداتا في terminal
  res.status(201).send("user Registered"); // رساله انه تم تسجيل الدخول
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body; // ليجيب الداتا الي رح يعبيها اليوزر
  const trimmedEmail = email.trim(); // لنشيل الفراغات من الايميل
  const trimmedPassword = password.trim(); // لنشيل الفراغات من الباسورد

  const user = users.find(
    (u) => u.email === trimmedEmail && u.password === trimmedPassword
  ); // فلتر للتاكد اذا اليوزر موجود او لا

  if (!user) return res.status(400).send("Invalid credentials"); // اذا مش موجود رجع هاد الايرور

  const token = jwt.sign({ email: user.email }, "secretKey", {
    expiresIn: "1h", // لتحديد كم رح يضل اليوزر بلموقع
  }); // اذا كان اليوزر موجود رح ينشئ token

  res.cookie("token", token, {
    // لارسال ال token من خلال cookie
    httpOnly: true, // منح الفرونت من الوصول لل cookie
    sameSite: "lax",
    secure: false,
  });

  res.send(`Logged in successfully`); // رساله انه تم تسجيل الدخول
});

//-----------------------
// Sign in
//-----------------------

app.get("/profile", authenticateToken, (req, res) => {
  // authenticateToken: للتاكد اذا الايميل موجود في التوكين
  const user = users.find((u) => u.email === req.user.email); // جلب اليوزر
  if (!user) return res.status(404).send("user not found"); // ايرور في حالم لم يكن اليوزر موجود
  res.send(`Welcome ${user.email}`); // رساله ترحيبيه اذا كان اليوزر موجود
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`); // طباعه البورت في التيرمنال
});
