const uploadForm =
  document.getElementById("uploadForm");

const passwordInput =
  document.getElementById("password");

const categoryInput =
  document.getElementById("category");

const titleInput =
  document.getElementById("title");

const photosInput =
  document.getElementById("photos");

const wideInput =
  document.getElementById("wide");

const selectedFiles =
  document.getElementById("selectedFiles");

const uploadBtn =
  document.getElementById("uploadBtn");

const uploadStatus =
  document.getElementById("uploadStatus");

const photoList =
  document.getElementById("photoList");

const filterCategory =
  document.getElementById("filterCategory");

const refreshBtn =
  document.getElementById("refreshBtn");

const imageModal =
  document.getElementById("imageModal");

const modalImage =
  document.getElementById("modalImage");

const closeModal =
  document.getElementById("closeModal");


const categoryNames = {
  events: "🎉 Баярын арга хэмжээ",
  awards: "🏆 Медаль, шагнал",
  travel: "🚌 Аялал",
  free: "📸 Чөлөөт зураг"
};


// =====================================
// PASSWORD
// =====================================

const savedPassword =
  sessionStorage.getItem(
    "teacherAdminPassword"
  );

if (savedPassword) {
  passwordInput.value =
    savedPassword;
}


// =====================================
// SELECT FILES
// =====================================

photosInput.addEventListener(
  "change",
  () => {

    const files =
      Array.from(
        photosInput.files
      );

    if (files.length === 0) {

      selectedFiles.textContent =
        "Зураг сонгоогүй байна.";

      return;
    }

    selectedFiles.textContent =
      `${files.length} зураг сонгогдлоо: ` +
      files
        .map(file => file.name)
        .join(", ");

  }
);


// =====================================
// STATUS
// =====================================

function setStatus(
  message,
  type
) {

  uploadStatus.textContent =
    message;

  uploadStatus.className =
    `status show ${type}`;

}


// =====================================
// UPLOAD
// =====================================

uploadForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const password =
      passwordInput.value.trim();

    const files =
      Array.from(
        photosInput.files
      );


    if (!password) {

      setStatus(
        "Admin нууц үгээ оруулна уу.",
        "error"
      );

      return;
    }


    if (files.length === 0) {

      setStatus(
        "Ядаж нэг зураг сонгоно уу.",
        "error"
      );

      return;
    }


    sessionStorage.setItem(
      "teacherAdminPassword",
      password
    );


    const formData =
      new FormData();


    formData.append(
      "category",
      categoryInput.value
    );


    formData.append(
      "title",
      titleInput.value.trim()
    );


    formData.append(
      "wide",
      wideInput.checked
        ? "true"
        : "false"
    );


    files.forEach(file => {

      formData.append(
        "photos",
        file
      );

    });


    uploadBtn.disabled =
      true;

    uploadBtn.textContent =
      "⏳ Upload хийж байна...";

    setStatus(
      "Зургуудыг Cloudinary руу upload хийж байна...",
      "loading"
    );


    try {

      const response =
        await fetch(
          "/api/photos",
          {
            method: "POST",

            headers: {
              "x-admin-password":
                password
            },

            body:
              formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Upload амжилтгүй."
        );

      }


      setStatus(
        `✅ ${data.photos.length} зураг амжилттай нэмэгдлээ.`,
        "success"
      );


      photosInput.value = "";

      titleInput.value = "";

      wideInput.checked =
        false;

      selectedFiles.textContent =
        "Зураг сонгоогүй байна.";


      await loadPhotos();

    } catch (error) {

      setStatus(
        "❌ " + error.message,
        "error"
      );

    } finally {

      uploadBtn.disabled =
        false;

      uploadBtn.textContent =
        "☁️ Зураг upload хийх";

    }

  }
);


// =====================================
// LOAD PHOTOS
// =====================================

async function loadPhotos() {

  photoList.innerHTML =
    `<div class="loading">
      Зургуудыг ачаалж байна...
    </div>`;


  try {

    let url =
      "/api/photos";


    if (
      filterCategory.value
    ) {

      url +=
        "?category=" +
        encodeURIComponent(
          filterCategory.value
        );

    }


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "Зургуудыг авч чадсангүй."
      );

    }


    const photos =
      await response.json();


    renderPhotos(photos);

  } catch (error) {

    photoList.innerHTML =
      `<div class="empty">
        ❌ ${escapeHtml(
          error.message
        )}
      </div>`;

  }

}


// =====================================
// RENDER PHOTOS
// =====================================

function renderPhotos(photos) {

  photoList.innerHTML = "";


  if (photos.length === 0) {

    photoList.innerHTML =
      `<div class="empty">
        Одоогоор зураг байхгүй байна ♡
      </div>`;

    return;
  }


  photos.forEach(photo => {

    const card =
      document.createElement("div");

    card.className =
      "photo-item";


    const image =
      document.createElement("img");

    image.className =
      "photo-image";

    image.src =
      photo.imageUrl;

    image.alt =
      photo.title ||
      "Дурсамж";

    image.loading =
      "lazy";


    image.addEventListener(
      "click",
      () => {

        modalImage.src =
          photo.imageUrl;

        imageModal.classList.add(
          "show"
        );

      }
    );


    const info =
      document.createElement("div");

    info.className =
      "photo-info";


    const title =
      document.createElement("h3");

    title.textContent =
      photo.title ||
      "Дурсамж ♡";


    const category =
      document.createElement("p");

    category.textContent =
      categoryNames[
        photo.category
      ] || photo.category;


    info.appendChild(title);

    info.appendChild(category);


    if (photo.wide) {

      const badge =
        document.createElement(
          "span"
        );

      badge.className =
        "wide-badge";

      badge.textContent =
        "🖼 Том зураг";

      info.appendChild(badge);

    }


    const deleteBtn =
      document.createElement(
        "button"
      );

    deleteBtn.className =
      "delete-btn";

    deleteBtn.textContent =
      "🗑 Устгах";


    deleteBtn.addEventListener(
      "click",
      () => {
        deletePhoto(
          photo._id
        );
      }
    );


    info.appendChild(deleteBtn);

    card.appendChild(image);

    card.appendChild(info);

    photoList.appendChild(card);

  });

}


// =====================================
// DELETE
// =====================================

async function deletePhoto(id) {

  let password =
    passwordInput.value.trim();


  if (!password) {

    password =
      prompt(
        "Admin нууц үгээ оруулна уу:"
      );

  }


  if (!password) return;


  const confirmed =
    confirm(
      "Энэ зургийг үнэхээр устгах уу?"
    );


  if (!confirmed) return;


  try {

    const response =
      await fetch(
        `/api/photos/${id}`,
        {
          method: "DELETE",

          headers: {
            "x-admin-password":
              password
          }
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Устгаж чадсангүй."
      );

    }


    await loadPhotos();

  } catch (error) {

    alert(
      "❌ " +
      error.message
    );

  }

}


// =====================================
// FILTER
// =====================================

filterCategory.addEventListener(
  "change",
  loadPhotos
);


refreshBtn.addEventListener(
  "click",
  loadPhotos
);


// =====================================
// MODAL
// =====================================

closeModal.addEventListener(
  "click",
  () => {

    imageModal.classList.remove(
      "show"
    );

  }
);


imageModal.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      imageModal
    ) {

      imageModal.classList.remove(
        "show"
      );

    }

  }
);


// =====================================
// SECURITY HELPER
// =====================================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value);

  return div.innerHTML;

}


// =====================================
// START
// =====================================

loadPhotos();