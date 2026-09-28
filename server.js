require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


// ========================================
// CLOUDINARY
// ========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ========================================
// MONGODB
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB error:", error.message);
  });


// ========================================
// PHOTO MODEL
// ========================================

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true,
      enum: ["events", "awards", "travel", "free"]
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
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", photoSchema);


// ========================================
// MULTER
// ========================================

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 20
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Зөвхөн зураг upload хийж болно."));
    }
  }
});


// ========================================
// ADMIN AUTH
// ========================================

function checkAdmin(req, res, next) {
  const password = req.headers["x-admin-password"];

  if (
    !process.env.ADMIN_PASSWORD ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Admin нууц үг буруу байна."
    });
  }

  next();
}


// Login шалгах

app.post("/api/admin/login", checkAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Амжилттай нэвтэрлээ."
  });
});


// ========================================
// GET PHOTOS
// ========================================

app.get("/api/photos", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const photos = await Photo.find(filter).sort({
      order: 1,
      createdAt: -1
    });

    res.json(photos);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Зургуудыг авч чадсангүй."
    });
  }
});


// ========================================
// UPLOAD
// ========================================

app.post(
  "/api/photos",
  checkAdmin,
  upload.array("photos", 20),

  async (req, res) => {
    const createdPhotos = [];

    try {
      if (!req.files?.length) {
        return res.status(400).json({
          message: "Зураг сонгоогүй байна."
        });
      }

      const categories = [
        "events",
        "awards",
        "travel",
        "free"
      ];

      if (!categories.includes(req.body.category)) {
        return res.status(400).json({
          message: "Ангилал буруу байна."
        });
      }

      const lastPhoto = await Photo
        .findOne({ category: req.body.category })
        .sort({ order: -1 });

      let nextOrder = lastPhoto
        ? lastPhoto.order + 1
        : 0;

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "teacher-day",
            resource_type: "image"
          }
        );

        const photo = await Photo.create({
          title: req.body.title || "",
          category: req.body.category,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          wide: req.body.wide === "true",
          order: nextOrder++
        });

        createdPhotos.push(photo);

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }

      res.status(201).json({
        message: "Зураг амжилттай нэмэгдлээ.",
        photos: createdPhotos
      });

    } catch (error) {
      console.error(error);

      if (req.files) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      res.status(500).json({
        message: "Upload хийх үед алдаа гарлаа."
      });
    }
  }
);


// ========================================
// EDIT PHOTO
// ========================================

app.put(
  "/api/photos/:id",
  checkAdmin,

  async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.id);

      if (!photo) {
        return res.status(404).json({
          message: "Зураг олдсонгүй."
        });
      }

      if (typeof req.body.title === "string") {
        photo.title = req.body.title.trim();
      }

      if (
        typeof req.body.wide === "boolean"
      ) {
        photo.wide = req.body.wide;
      }

      const categories = [
        "events",
        "awards",
        "travel",
        "free"
      ];

      if (
        req.body.category &&
        categories.includes(req.body.category)
      ) {
        photo.category = req.body.category;
      }

      await photo.save();

      res.json({
        message: "Зураг шинэчлэгдлээ.",
        photo
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Зургийг шинэчилж чадсангүй."
      });
    }
  }
);


// ========================================
// REORDER
// ========================================

app.put(
  "/api/photos/reorder/all",
  checkAdmin,

  async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({
          message: "Зургийн дараалал буруу байна."
        });
      }

      await Promise.all(
        ids.map((id, index) =>
          Photo.findByIdAndUpdate(
            id,
            { order: index }
          )
        )
      );

      res.json({
        message: "Дараалал хадгалагдлаа."
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Дарааллыг хадгалж чадсангүй."
      });
    }
  }
);


// ========================================
// DELETE
// ========================================

app.delete(
  "/api/photos/:id",
  checkAdmin,

  async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.id);

      if (!photo) {
        return res.status(404).json({
          message: "Зураг олдсонгүй."
        });
      }

      await cloudinary.uploader.destroy(
        photo.publicId
      );

      await photo.deleteOne();

      res.json({
        message: "Зураг устгагдлаа."
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Зургийг устгаж чадсангүй."
      });
    }
  }
);


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: error.message || "Server error"
  });
});


// ========================================
// START
// ========================================

app.listen(PORT, () => {
  console.log(
    `🌸 Teacher Day server running on port ${PORT}`
  );
});