const express = require("express");

const app = express();

const PORT =5000;

app.use(express.json());

app.get("/",(req, res)=> {
    res.json({
        success: true,
        message: "Employee Leave Managment API is running",
    });
});

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});