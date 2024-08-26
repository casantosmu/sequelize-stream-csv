import { sequelize, User } from "./db.js";

try {
  await sequelize.sync({ force: true });

  for (let i = 0; i < 100000; i++) {
    await User.create({
      name: `user_${i}`,
      email: `user_${i}@example.com`,
      age: Math.floor(Math.random() * 50) + 20,
    });
  }

  console.log("Database setup complete.");
} catch (error) {
  console.error("Error setting up the database:", error);
  process.exit(1);
}
