const express = require("express");
const cors = require("cors");

const authRoutes =
    require("./routes/authRoutes");

const leaveRoutes =
    require("./routes/leaveRoutes");

const managerRoutes =
    require("./routes/managerRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");


const app = express();

const PORT =
    process.env.PORT || 5000;


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

    res.json({
        success: true,
        message:
            "Employee Leave Management API Running",
    });

});


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/leaves",
    leaveRoutes
);


app.use(
    "/api/manager",
    managerRoutes
);


app.use(
    "/api/notifications",
    notificationRoutes
);


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});