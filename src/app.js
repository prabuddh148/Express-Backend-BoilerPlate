import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/indexRoutes.js";
import morgan from "morgan";
import { swaggerSpec, swaggerUi } from "./config/swaggerConfig.js";

// ------------------ __dirname replacement ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -----------------------------
// Security Middlewares
// -----------------------------

// Enable Helmet for secure headers
app.use(helmet());

// Enable CORS properly
app.use(
  cors({
    origin: ["http://localhost:3000"], // your frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



// Body parsers
app.use(morgan("dev"));
// app.use(express.json({ limit: "1mb" })); //// if you want limit
////BODY PARSER
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


// Serve static files (index.html)
// Correct path to public folder (one level up)
const publicPath = path.join(process.cwd(), "public");

app.use(express.static(publicPath));

// Serve index.html for root
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "index.html"));
  res.sendFile(path.join(publicPath, "index.html"));
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiter to prevent brute-force attacks
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 mins
//   max: 150, // limit each IP
//   message: "Too many requests from this IP. Try again later.",
// });


const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 10, // limit each IP
  message: "Too many requests from this IP. Try again later.",
});

app.use("/api/", apiLimiter);
// 🟢 MOUNT ROUTES HERE
app.use("/api", routes);   // ✅ THIS MAKES /api/departments WORK

export default app;
