const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "employee-leave-management/leaves",

                resource_type: "auto",

                public_id:
                    `${Date.now()}-${originalName
                        .replace(/\.[^/.]+$/, "")
                        .replace(/[^a-zA-Z0-9-_]/g, "-")}`,
            },

            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        streamifier
            .createReadStream(fileBuffer)
            .pipe(uploadStream);
    });
};

module.exports = uploadToCloudinary;