import express from "express";
import cors from "cors";

const app = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () =>console.log(`Server running on http://localhost:${PORT}`));