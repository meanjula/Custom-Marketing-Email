import express from "express"
import cors from "cors"

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions))
app.use(express.json())


// Health check route
app.get("/", (req,res)=>{
    res.send("Server is running! Use POST /api/chat to interact.");
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})