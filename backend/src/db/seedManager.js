require("dotenv").config();
const pool =require("../config/db");
const {hashPassword} =require("../utils/Password");

const MANAGER = {
    username: process.env.MANAGER_USERNAME,
    password: process.env.MANAGER_PASSWORD,
    role: "manager",
};

async function seedManager(){
    try{
        console.log("Checking manager account...");

        const existingManager =await pool.query(
            "SELECT ID FROM users WHERE username =$1",
            [MANAGER.username]
        );
        if(existingManager.rows.length > 0){
            console.log("Manager account already exists.");
            return;
        }
        const hashedPassword =await hashPassword(MANAGER.Password);

        await pool.query(
            `
            INSERT INTO users (username, password, role)
            VALUES ($1, $2, $3)
            `,
            [
                MANAGER.username,
                hashedPassword,
                MANAGER.role,
            ]
        );
        console.log("Manager account created successfully!");
        console.log("--------------------------------------");
        console.log("Username:",MANAGER.username);
        console.log("password:",MANAGER.Password);
        console.log("---------------------------------------");
    }catch(error){
        console.error("seed Error:",error);

    }finally{
        await pool.end();
    }
};
seedManager();