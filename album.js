const openAlbumBtn =
  document.getElementById("openAlbumBtn");

const categorySection =
  document.getElementById("categorySection");

const gallerySection =
  document.getElementById("gallerySection");

const galleryTitle =
  document.getElementById("galleryTitle");

const photoGrid =
  document.getElementById("photoGrid");

const backBtn =
  document.getElementById("backBtn");

const imageModal =
  document.getElementById("imageModal");

const modalImage =
  document.getElementById("modalImage");

const modalCaption =
  document.getElementById("modalCaption");

const closeModal =
  document.getElementById("closeModal");


const categoryNames = {
  events: "🎉 Баярын арга хэмжээ",

  awards:
    "🏆 Медаль, шагнал, тэмцээн уралдаан",

  travel: "🚌 Аялал",

  free: "📸 Чөлөөт зургууд"
};


// ===============================
// OPEN ALBUM
// ===============================

openAlbumBtn.addEventListener(
  "click",
  () => {

    categorySection.classList.add(
      "show"
    );

    categorySection.scrollIntoView({
      behavior: "smooth"
    });

  }
);


// ===============================
// CATEGORY
// ===============================

document
  .querySelectorAll(".category-card")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const category =
          button.dataset.category;

        openCategory(category);

      }
    );

  });


async function openCategory(category) {

  galleryTitle.textContent =
    categoryNames[category] ||
    "Дурсамж";


  categorySection.classList.remove(
    "show"
  );

  gallerySection.classList.add(
    "show"
  );


  photoGrid.innerHTML = `
    <div class="album-status">
      <div>♡</div>
      Дурсамжуудыг ачаалж байна...
    </div>
  `;


  gallerySection.scrollIntoView({
    behavior: "smooth"
  });


  try {

    const response =
      await fetch(
        `/api/photos?category=${encodeURIComponent(category)}`
      );


    if (!response.ok) {

      throw new Error(
        "Зургуудыг авч чадсангүй."
      );

    }


    const photos =
      await response.json();


    renderPhotos(photos);

  } catch (error) {

    photoGrid.innerHTML = `
      <div class="album-status">
        <div>🥀</div>

        ${escapeHtml(error.message)}

        <br><br>

        Түр хүлээгээд дахин оролдоно уу.
      </div>
    `;

  }

}


// ===============================
// RENDER
// ===============================

function renderPhotos(photos) {

  photoGrid.innerHTML = "";


  if (
    !Array.isArray(photos) ||
    photos.length === 0
  ) {

    photoGrid.innerHTML = `
      <div class="album-status">

        <div>📷</div>

        Одоогоор энэ хэсэгт
        зураг нэмэгдээгүй байна ♡

      </div>
    `;

    return;

  }


  photos.forEach(
    (photo, index) => {

      const card =
        document.createElement("article");


      card.className =
        "photo-card";


      if (photo.wide) {

        card.classList.add(
          "wide"
        );

      }


      const image =
        document.createElement("img");


      image.src =
        photo.imageUrl;


      image.alt =
        photo.title ||
        `Дурсамж ${index + 1}`;


      image.loading =
        "lazy";


      image.addEventListener(
        "click",
        () => {

          openImage(
            photo.imageUrl,
            photo.title ||
            `Дурсамж ${index + 1}`
          );

        }
      );


      card.appendChild(image);


      if (
        photo.title &&
        photo.title.trim()
      ) {

        const caption =
          document.createElement("div");


        caption.className =
          "photo-caption";


        caption.textContent =
          photo.title;


        card.appendChild(caption);

      }


      photoGrid.appendChild(card);

    }
  );

}


// ===============================
// BACK
// ===============================

backBtn.addEventListener(
  "click",
  () => {

    gallerySection.classList.remove(
      "show"
    );

    categorySection.classList.add(
      "show"
    );

    categorySection.scrollIntoView({
      behavior: "smooth"
    });

  }
);


// ===============================
// MODAL
// ===============================

function openImage(src, caption) {

  modalImage.src =
    src;

  modalCaption.textContent =
    caption || "";

  imageModal.classList.add(
    "show"
  );

  document.body.style.overflow =
    "hidden";

}


function closeImage() {

  imageModal.classList.remove(
    "show"
  );

  document.body.style.overflow =
    "";

}


closeModal.addEventListener(
  "click",
  closeImage
);


imageModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === imageModal
    ) {

      closeImage();

    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closeImage();

    }

  }
);


// ===============================
// SECURITY
// ===============================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value ?? "");

  return div.innerHTML;

}