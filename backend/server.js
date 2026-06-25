import dotenv from "dotenv";


dotenv.config();

import app from "./src/app.js";

import connectDB from "./src/config/db.js";

import aiRoutes from "./src/routes/ai.routes.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  "/api/ai",
  aiRoutes
);



app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});