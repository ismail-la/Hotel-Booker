import bcrypt from "bcrypt";

const users = new Map();

export default async function handler(req, res) {
  if (req.method === "POST") {
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

      return res.status(201).json({
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
