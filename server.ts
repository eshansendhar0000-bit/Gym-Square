import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import memberRoutes from "./routes/memberRoutes";
import adminRoutes from "./routes/adminRoutes";
import dietPlanRoutes from "./routes/dietPlanRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Gym Square API is running" });
});

app.use("/api/members", memberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/diet-plans", dietPlanRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Gym Square API listening on port ${PORT}`);
});
