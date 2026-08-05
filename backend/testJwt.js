require("dotenv").config();

const {
    generateToken,
    verifyToken,
} = require("./src/utils/jwt");

const token = generateToken({
    id: "123",
    username: "hemanth",
    role: "employee",
});

console.log("Generated Token:");
console.log(token);

console.log("\nDecoded Token:");
console.log(verifyToken(token));