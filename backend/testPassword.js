const { hashPassword, comparePassword } = require("./src/utils/password");

(async () => {
    const password = "Password123";

    const hash = await hashPassword(password);

    console.log("Hash:", hash);

    const isMatch = await comparePassword(password, hash);

    console.log("Password Match:", isMatch);
})();