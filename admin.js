let adminPassword = "";
let currentPhotos = [];
let editingPhotoId = null;


// ==============================
// ELEMENTS
// ==============================

const loginScreen =
  document.getElementById("loginScreen");

const dashboard =
  document.getElementById("dashboard");

const loginForm =
  document.getElementById("loginForm");

const loginPassword =
  document.getElementById("loginPassword");

const loginError =
  document.getElementById("loginError");

const logoutBtn =
  document.getElementById("logoutBtn");

const uploadForm =
  document.getElementById("uploadForm");

const category =
  document.getElementById("category");

const title =
  document.getElementById("title");

const photos =
  document.getElementById("photos");

const wide =
  document.getElementById("wide");

const selectedFiles =
  document.getElementById("selectedFiles");

const uploadBtn =
  document.getElementById("uploadBtn");

const uploadStatus =
  document.getElementById("uploadStatus");

const filterCategory =
  document.getElementById("filterCategory");

const refreshBtn =
  document.getElementById("refreshBtn");

const photoList =
  document.getElementById("photoList");

const editModal =
  document.getElementById("editModal");

const closeEdit =
  document.getElementById("closeEdit");

const editPreview =
  document.getElementById("editPreview");

const editTitle =
  document.getElementById("editTitle");

const editCategory =
  document.getElementById("editCategory");

const editWide =
  document.getElementById("editWide");

const saveEditBtn =
  document.getElementById("saveEditBtn");


const categoryNames = {
  events: "🎉 Баярын арга хэмжээ",
  awards: "🏆 Медаль, шагнал",
  travel: "🚌 Аялал",
  free: "📸 Чөлөөт зураг"
};


// ==============================
// LOGIN
// ==============================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const password =
      loginPassword.value.trim();

    if (!password) {
      return;
    }

    loginError.textContent =
      "Шалгаж байна...";

    try {

      const response =
        await fetch(
          "/api/admin/login",
          {
            method: "POST",

            headers: {
              "x-admin-password":
                password
            }
          }
        );


      if (!response.ok) {
        throw new Error(
          "Нууц үг буруу байна."
        );
      }


      adminPassword =
        password;


      sessionStorage.setItem(
        "teacherAdminPassword",
        password
      );


      showDashboard();

    } catch (error) {

      loginError.textContent =
        "❌ " + error.message;

    }

  }
);


// ==============================
// AUTO LOGIN
// ==============================

async function tryAutoLogin() {

  const saved =
    sessionStorage.getItem(
      "teacherAdminPassword"
    );

  if (!saved) {
    return;
  }


  try {

    const response =
      await fetch(
        "/api/admin/login",
        {
          method: "POST",

          headers: {
            "x-admin-password":
              saved
          }
        }
      );


    if (!response.ok) {
      throw new Error();
    }


    adminPassword =
      saved;


    showDashboard();

  } catch {

    sessionStorage.removeItem(
      "teacherAdminPassword"
    );

  }

}


// ==============================
// DASHBOARD
// ==============================

function showDashboard() {

  loginScreen.classList.add(
    "hidden"
  );

  dashboard.classList.remove(
    "hidden"
  );

  loadPhotos();

}


// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener(
  "click",
  () => {

    adminPassword = "";

    sessionStorage.removeItem(
      "teacherAdminPassword"
    );

    dashboard.classList.add(
      "hidden"
    );

    loginScreen.classList.remove(
      "hidden"
    );

    loginPassword.value = "";

    loginError.textContent = "";

  }
);


// ==============================
// FILE SELECT
// ==============================

photos.addEventListener(
  "change",
  () => {

    const files =
      Array.from(photos.files);


    if (!files.length) {

      selectedFiles.textContent =
        "Зураг сонгоогүй байна.";

      return;

    }


    selectedFiles.textContent =
      `${files.length} зураг сонгогдлоо`;

  }
);


// ==============================
// STATUS
// ==============================

function setStatus(
  message,
  type
) {

  uploadStatus.textContent =
    message;

  uploadStatus.className =
    `status show ${type}`;

}


// ==============================
// UPLOAD
// ==============================

uploadForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const files =
      Array.from(photos.files);


    if (!files.length) {

      setStatus(
        "Зураг сонгоно уу.",
        "error"
      );

      return;

    }


    const data =
      new FormData();


    data.append(
      "category",
      category.value
    );


    data.append(
      "title",
      title.value.trim()
    );


    data.append(
      "wide",
      wide.checked
        ? "true"
        : "false"
    );


    files.forEach((file) => {

      data.append(
        "photos",
        file
      );

    });


    uploadBtn.disabled = true;

    uploadBtn.textContent =
      "⏳ Upload хийж байна...";


    setStatus(
      "Cloudinary руу upload хийж байна...",
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
                adminPassword
            },

            body: data
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message
        );

      }


      setStatus(
        `✅ ${result.photos.length} зураг нэмэгдлээ.`,
        "success"
      );


      uploadForm.reset();

      selectedFiles.textContent =
        "Зураг сонгоогүй байна.";


      await loadPhotos();

    } catch (error) {

      setStatus(
        "❌ " + error.message,
        "error"
      );

    } finally {

      uploadBtn.disabled = false;

      uploadBtn.textContent =
        "☁️ Upload хийх";

    }

  }
);


// ==============================
// LOAD
// ==============================

async function loadPhotos() {

  photoList.innerHTML = `
    <div class="empty">
      Зургуудыг ачаалж байна...
    </div>
  `;


  try {

    let url =
      "/api/photos";


    if (filterCategory.value) {

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


    currentPhotos =
      await response.json();


    renderPhotos();

  } catch (error) {

    photoList.innerHTML = `
      <div class="empty">
        ❌ ${escapeHtml(error.message)}
      </div>
    `;

  }

}


// ==============================
// RENDER
// ==============================

function renderPhotos() {

  photoList.innerHTML = "";


  if (!currentPhotos.length) {

    photoList.innerHTML = `
      <div class="empty">
        Одоогоор зураг байхгүй ♡
      </div>
    `;

    return;

  }


  currentPhotos.forEach(
    (photo, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "photo-card";


      card.innerHTML = `

        <img
          src="${escapeAttribute(photo.imageUrl)}"
          alt="Дурсамж"
          loading="lazy"
        >

        <div class="photo-content">

          <h3>
            ${escapeHtml(
              photo.title ||
              "Дурсамж ♡"
            )}
          </h3>

          <p>
            ${
              categoryNames[
                photo.category
              ] || ""
            }
          </p>

          ${
            photo.wide
              ? `<span class="badge">
                   🖼 Том зураг
                 </span>`
              : ""
          }

          <div class="card-actions">

            <button
              class="move-up"
              title="Дээш"
            >
              ↑
            </button>

            <button
              class="move-down"
              title="Доош"
            >
              ↓
            </button>

            <button
              class="edit"
            >
              ✏️
            </button>

            <button
              class="delete"
            >
              🗑
            </button>

          </div>

        </div>
      `;


      card
        .querySelector(".move-up")
        .addEventListener(
          "click",
          () => movePhoto(
            index,
            -1
          )
        );


      card
        .querySelector(".move-down")
        .addEventListener(
          "click",
          () => movePhoto(
            index,
            1
          )
        );


      card
        .querySelector(".edit")
        .addEventListener(
          "click",
          () => openEdit(photo)
        );


      card
        .querySelector(".delete")
        .addEventListener(
          "click",
          () => deletePhoto(
            photo._id
          )
        );


      photoList.appendChild(card);

    }
  );

}


// ==============================
// EDIT
// ==============================

function openEdit(photo) {

  editingPhotoId =
    photo._id;


  editPreview.src =
    photo.imageUrl;


  editTitle.value =
    photo.title || "";


  editCategory.value =
    photo.category;


  editWide.checked =
    Boolean(photo.wide);


  editModal.classList.add(
    "show"
  );

}


closeEdit.addEventListener(
  "click",
  closeEditModal
);


editModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === editModal
    ) {

      closeEditModal();

    }

  }
);


function closeEditModal() {

  editModal.classList.remove(
    "show"
  );

  editingPhotoId = null;

}


// ==============================
// SAVE EDIT
// ==============================

saveEditBtn.addEventListener(
  "click",
  async () => {

    if (!editingPhotoId) {
      return;
    }


    saveEditBtn.disabled =
      true;


    try {

      const response =
        await fetch(
          `/api/photos/${editingPhotoId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              "x-admin-password":
                adminPassword
            },

            body: JSON.stringify({
              title:
                editTitle.value.trim(),

              category:
                editCategory.value,

              wide:
                editWide.checked
            })
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message
        );

      }


      closeEditModal();

      await loadPhotos();

    } catch (error) {

      alert(
        "❌ " + error.message
      );

    } finally {

      saveEditBtn.disabled =
        false;

    }

  }
);


// ==============================
// DELETE
// ==============================

async function deletePhoto(id) {

  const confirmed =
    confirm(
      "Энэ зургийг устгах уу?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        `/api/photos/${id}`,
        {
          method: "DELETE",

          headers: {
            "x-admin-password":
              adminPassword
          }
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message
      );

    }


    await loadPhotos();

  } catch (error) {

    alert(
      "❌ " + error.message
    );

  }

}


// ==============================
// REORDER
// ==============================

async function movePhoto(
  index,
  direction
) {

  const newIndex =
    index + direction;


  if (
    newIndex < 0 ||
    newIndex >=
      currentPhotos.length
  ) {
    return;
  }


  [
    currentPhotos[index],
    currentPhotos[newIndex]
  ] = [
    currentPhotos[newIndex],
    currentPhotos[index]
  ];


  renderPhotos();


  try {

    const ids =
      currentPhotos.map(
        photo => photo._id
      );


    const response =
      await fetch(
        "/api/photos/reorder/all",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            "x-admin-password":
              adminPassword
          },

          body: JSON.stringify({
            ids
          })
        }
      );


    if (!response.ok) {

      throw new Error(
        "Дарааллыг хадгалж чадсангүй."
      );

    }

  } catch (error) {

    alert(
      "❌ " + error.message
    );

    await loadPhotos();

  }

}


// ==============================
// FILTER
// ==============================

filterCategory.addEventListener(
  "change",
  loadPhotos
);


refreshBtn.addEventListener(
  "click",
  loadPhotos
);


// ==============================
// ESCAPE
// ==============================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value ?? "");

  return div.innerHTML;

}


function escapeAttribute(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

}


// ==============================
// START
// ==============================

tryAutoLogin();