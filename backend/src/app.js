const express = require("express");
const pool = require("./config/db");

const app = express();

const PORT =process.env.PORT || 5000;

app.use(express.json());

app.get("/",(req, res)=> {
    res.json({
        success: true,
        message: "Employee Leave Managment API is running",
    });
});

app.get("/api/health/db", async (req, res)=>{
    try{
        const result = await pool.query("SELECT NOW()");

        res.json({
            sucess: true,
            message: "Database connection successful",
            databaseTime:result.rows[0].now
,        });
    } catch(error){
        console.error("Database connection error:", error);

         res.json({
            sucess: false,
            message: "Database connection failed",
        });
    }
})

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});