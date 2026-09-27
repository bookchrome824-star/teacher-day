require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTML / CSS / JS файлуудаа serve хийнэ
app.use(express.static(path.join(__dirname)));


// =====================================
// CLOUDINARY
// =====================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// =====================================
// MONGODB
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB error:", error.message);
  });


// =====================================
// PHOTO MODEL
// =====================================

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true,
      enum: [
        "events",
        "awards",
        "travel",
        "free"
      ]
    },

    imageUrl: {
      type: String,
      required: true
    },

    publicId: {
      type: String,
      required: true
    },

    wide: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


const Photo = mongoose.model(
  "Photo",
  photoSchema
);


// =====================================
// MULTER
// =====================================

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {

    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Зөвхөн зураг upload хийж болно."
        )
      );
    }

  }
});


// =====================================
// SIMPLE ADMIN PASSWORD
// =====================================

function checkAdmin(req, res, next) {

  const password =
    req.headers["x-admin-password"];

  if (
    !process.env.ADMIN_PASSWORD ||
    password !== process.env.ADMIN_PASSWORD
  ) {

    return res.status(401).json({
      message: "Admin password буруу байна."
    });

  }

  next();
}


// =====================================
// GET ALL PHOTOS
// =====================================

app.get("/api/photos", async (req, res) => {

  try {

    const filter = {};

    if (req.query.category) {
      filter.category =
        req.query.category;
    }

    const photos =
      await Photo
        .find(filter)
        .sort({ createdAt: -1 });

    res.json(photos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Зургуудыг авч чадсангүй."
    });

  }

});


// =====================================
// UPLOAD PHOTO
// =====================================

app.post(
  "/api/photos",
  checkAdmin,
  upload.array("photos", 20),
  async (req, res) => {

    const uploadedPhotos = [];

    try {

      if (
        !req.files ||
        req.files.length === 0
      ) {

        return res.status(400).json({
          message:
            "Зураг сонгоогүй байна."
        });

      }


      const allowedCategories = [
        "events",
        "awards",
        "travel",
        "free"
      ];


      if (
        !allowedCategories.includes(
          req.body.category
        )
      ) {

        return res.status(400).json({
          message:
            "Ангилал буруу байна."
        });

      }


      for (const file of req.files) {

        const result =
          await cloudinary.uploader.upload(
            file.path,
            {
              folder:
                "teacher-day"
            }
          );


        const photo =
          await Photo.create({
            title:
              req.body.title || "",

            category:
              req.body.category,

            imageUrl:
              result.secure_url,

            publicId:
              result.public_id,

            wide:
              req.body.wide === "true"
          });


        uploadedPhotos.push(photo);


        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

      }


      res.status(201).json({
        message:
          "Зураг амжилттай нэмэгдлээ.",

        photos:
          uploadedPhotos
      });

    } catch (error) {

      console.error(error);


      if (req.files) {

        req.files.forEach((file) => {

          if (
            fs.existsSync(file.path)
          ) {
            fs.unlinkSync(file.path);
          }

        });

      }


      res.status(500).json({
        message:
          "Upload хийх үед алдаа гарлаа."
      });

    }

  }
);


// =====================================
// DELETE PHOTO
// =====================================

app.delete(
  "/api/photos/:id",
  checkAdmin,
  async (req, res) => {

    try {

      const photo =
        await Photo.findById(
          req.params.id
        );


      if (!photo) {

        return res.status(404).json({
          message:
            "Зураг олдсонгүй."
        });

      }


      await cloudinary.uploader.destroy(
        photo.publicId
      );


      await photo.deleteOne();


      res.json({
        message:
          "Зураг устгагдлаа."
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Зургийг устгаж чадсангүй."
      });

    }

  }
);


// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "index.html"
    )
  );

});


// =====================================
// ERROR HANDLER
// =====================================

app.use((error, req, res, next) => {

  console.error(error);

  res.status(500).json({
    message:
      error.message ||
      "Server error"
  });

});


// =====================================
// START
// =====================================

app.listen(PORT, () => {

  console.log(
    `🌸 Teacher Day server running on port ${PORT}`
  );

});