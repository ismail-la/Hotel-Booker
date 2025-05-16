// server/server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const app = express();
const PORT = process.env.PORT || 5000;

// Basic user store for demonstration
const users = new Map();
// Add a test user
users.set("admin", {
  id: 1,
  username: "admin",
  password: "$2b$10$GGdfZrCtBJ0Nms9NRhJiSuJCM1xgU6w3RGGqEZL5sK76j8Q79nIUa", // Secured hash
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  isAdmin: true,
});

// Parse JSON bodies
app.use(express.json());

// Configure session
const sessionSettings = {
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000, // 24 hours
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
};

app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = users.get(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = users.get(username);
  done(null, user);
});

// Sample hotels data
const hotels = [
  {
    id: 1,
    name: "Luxor Grand Hotel",
    location: "Downtown, New York City",
    description:
      "The Luxor Grand Hotel is a 5-star luxury hotel located in the heart of Downtown New York City.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 5,
    reviewCount: 356,
    pricePerNight: 220,
    discountPercentage: 20,
    status: "active",
  },
  {
    id: 2,
    name: "Seaside Resort & Spa",
    location: "Beachfront, Miami",
    description:
      "A beautiful beachfront resort with stunning ocean views and luxurious spa facilities.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    rating: 4,
    reviewCount: 289,
    pricePerNight: 245,
    discountPercentage: 0,
    status: "active",
  },
];

// Auth routes
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    });
  })(req, res, next);
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    if (users.has(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.size + 1,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      isAdmin: false,
    };

    users.set(username, newUser);

    req.login(newUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error during login after registration" });
      }
      return res.status(201).json({
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.get("/api/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    username: req.user.username,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

// Hotel routes
app.get("/api/hotels", (req, res) => {
  res.json(hotels);
});

app.get("/api/hotels/:id", (req, res) => {
  const hotel = hotels.find((h) => h.id === parseInt(req.params.id));
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found" });
  }
  res.json(hotel);
});

// Handle CORS for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
