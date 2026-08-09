const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ========================================
// CLOUDINARY STORAGE
// ========================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "employee-leave-management/leaves",

        allowed_formats: [
            "pdf",
            "jpg",
            "jpeg",
            "png",
        ],
    },
});

// ========================================
// ALLOWED FILE TYPES
// ========================================

const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];

// ========================================
// FILE VALIDATION
// ========================================

const fileFilter = (req, file, cb) => {

    if (allowedMimeTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF, JPG, and PNG files are allowed"
            ),
            false
        );
    }
};

// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});

// ========================================
// EXPORT
// ========================================

module.exports = upload;