// ======================================================
// TEACHER DAY WEBSITE
// script.js
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const envelope = document.getElementById("envelope");
const openText = document.querySelector(".open-text");

const music = document.getElementById("backgroundMusic");
const musicBtn = document.getElementById("musicBtn");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModalBtn = document.getElementById("closeModal");

const albumHome = document.getElementById("albumHome");
const albumCategories = document.getElementById("albumCategories");
const categoryGallery = document.getElementById("categoryGallery");

const openAlbumBtn = document.getElementById("openAlbumBtn");
const closeAlbumBtn = document.getElementById("closeAlbumBtn");
const backCategoriesBtn = document.getElementById("backCategoriesBtn");

const categoryTitle = document.getElementById("categoryTitle");
const categoryPhotoGrid = document.getElementById("categoryPhotoGrid");


// ======================================================
// CATEGORY DATA
// ======================================================

const categoryData = {

  events: {
    title: "🎉 Баярын арга хэмжээ"
  },

  awards: {
    title: "🏆 Медаль, шагнал, тэмцээн уралдаан"
  },

  travel: {
    title: "🚌 Аялал"
  },

  free: {
    title: "📸 Чөлөөт зургууд"
  }

};


// ======================================================
// SCROLL REVEAL
// ======================================================

const revealItems = document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const revealObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

        }

      });

    },
    {
      threshold: 0.1
    }
  );


  revealItems.forEach((item) => {

    revealObserver.observe(item);

  });

} else {

  revealItems.forEach((item) => {

    item.classList.add("active");

  });

}


// ======================================================
// SMOOTH NAVIGATION
// ======================================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");


      if (!targetId || targetId === "#") {
        return;
      }


      const target =
        document.querySelector(targetId);


      if (!target) {
        return;
      }


      event.preventDefault();


      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


// ======================================================
// LETTER / ENVELOPE
// ======================================================

if (envelope) {

  envelope.addEventListener("click", () => {

    envelope.classList.toggle("open");


    if (
      envelope.classList.contains("open")
    ) {

      if (openText) {

        openText.textContent =
          "Захидлыг хаахын тулд дахин дараарай ♡";

      }

    } else {

      if (openText) {

        openText.textContent =
          "Дугтуйн дээр дараарай";

      }

    }

  });

}


// ======================================================
// MUSIC
// ======================================================

let musicPlaying = false;


if (music && musicBtn) {

  musicBtn.addEventListener(
    "click",
    async () => {

      try {

        if (!musicPlaying) {

          await music.play();

          musicPlaying = true;

          musicBtn.textContent =
            "❚❚ Зогсоох";

          musicBtn.classList.add(
            "playing"
          );

        } else {

          music.pause();

          musicPlaying = false;

          musicBtn.textContent =
            "♫ Ая";

          musicBtn.classList.remove(
            "playing"
          );

        }

      } catch (error) {

        console.error(
          "Music error:",
          error
        );


        alert(
          "music.mp3 файлаа шалгаарай."
        );

      }

    }
  );


  music.addEventListener(
    "ended",
    () => {

      musicPlaying = false;

      musicBtn.textContent =
        "♫ Ая";

      musicBtn.classList.remove(
        "playing"
      );

    }
  );

}


// ======================================================
// IMAGE MODAL
// ======================================================

function openImage(
  src,
  alt = "Дурсамж"
) {

  if (
    !imageModal ||
    !modalImage ||
    !src
  ) {
    return;
  }


  modalImage.src = src;
  modalImage.alt = alt;


  imageModal.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";

}


function closeImage() {

  if (!imageModal) {
    return;
  }


  imageModal.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


if (closeModalBtn) {

  closeModalBtn.addEventListener(
    "click",
    closeImage
  );

}


if (imageModal) {

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

}


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closeImage();

    }

  }
);


// ======================================================
// TEACHER PHOTO MODAL
// ======================================================

const teacherPhoto =
  document.querySelector(
    ".teacher-photo"
  );


if (teacherPhoto) {

  teacherPhoto.addEventListener(
    "click",
    () => {

      openImage(
        teacherPhoto.src,
        teacherPhoto.alt || "Манай багш"
      );

    }
  );

}


// ======================================================
// OPEN ALBUM
// ======================================================

if (openAlbumBtn) {

  openAlbumBtn.addEventListener(
    "click",
    () => {

      if (albumHome) {

        albumHome.classList.add(
          "hide"
        );

      }


      if (categoryGallery) {

        categoryGallery.classList.remove(
          "show"
        );

      }


      if (albumCategories) {

        albumCategories.classList.add(
          "show"
        );

      }

    }
  );

}


// ======================================================
// CLOSE ALBUM
// ======================================================

if (closeAlbumBtn) {

  closeAlbumBtn.addEventListener(
    "click",
    () => {

      if (albumCategories) {

        albumCategories.classList.remove(
          "show"
        );

      }


      if (categoryGallery) {

        categoryGallery.classList.remove(
          "show"
        );

      }


      if (albumHome) {

        albumHome.classList.remove(
          "hide"
        );

      }

    }
  );

}


// ======================================================
// CATEGORY BUTTONS
// ======================================================

const categoryButtons =
  document.querySelectorAll(
    ".category-card"
  );


categoryButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const category =
          button.dataset.category;


        if (!category) {
          return;
        }


        openCategory(category);

      }
    );

  }
);


// ======================================================
// OPEN CATEGORY
// ======================================================

async function openCategory(category) {

  const data =
    categoryData[category];


  if (!data) {

    console.error(
      "Unknown category:",
      category
    );

    return;

  }


  // TITLE

  if (categoryTitle) {

    categoryTitle.textContent =
      data.title;

  }


  // SHOW GALLERY

  if (albumCategories) {

    albumCategories.classList.remove(
      "show"
    );

  }


  if (categoryGallery) {

    categoryGallery.classList.add(
      "show"
    );

  }


  // LOADING

  if (categoryPhotoGrid) {

    categoryPhotoGrid.innerHTML = `
      <div class="album-loading">
        <div class="album-loading-icon">
          ♡
        </div>

        <p>
          Дурсамжуудыг ачаалж байна...
        </p>
      </div>
    `;

  }


  scrollToAlbum();


  // LOAD FROM MONGODB API

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


    renderCategoryPhotos(
      photos,
      data.title
    );

  } catch (error) {

    console.error(
      "Album error:",
      error
    );


    if (categoryPhotoGrid) {

      categoryPhotoGrid.innerHTML = `
        <div class="album-error">

          <div class="album-error-icon">
            ♡
          </div>

          <h3>
            Зургуудыг ачаалж чадсангүй
          </h3>

          <p>
            Түр хүлээгээд дахин оролдоно уу.
          </p>

          <button
            type="button"
            class="retry-album-btn"
            id="retryAlbumBtn"
          >
            Дахин оролдох
          </button>

        </div>
      `;


      const retryButton =
        document.getElementById(
          "retryAlbumBtn"
        );


      if (retryButton) {

        retryButton.addEventListener(
          "click",
          () => {

            openCategory(category);

          }
        );

      }

    }

  }

}


// ======================================================
// RENDER CATEGORY PHOTOS
// ======================================================

function renderCategoryPhotos(
  photos,
  categoryName
) {

  if (!categoryPhotoGrid) {
    return;
  }


  categoryPhotoGrid.innerHTML = "";


  // EMPTY

  if (
    !Array.isArray(photos) ||
    photos.length === 0
  ) {

    categoryPhotoGrid.innerHTML = `
      <div class="album-empty">

        <div class="album-empty-icon">
          📷
        </div>

        <h3>
          Одоогоор зураг байхгүй байна
        </h3>

        <p>
          Энэ хэсэгт удахгүй шинэ дурсамжууд нэмэгдэнэ ♡
        </p>

      </div>
    `;

    return;

  }


  // PHOTOS

  photos.forEach(
    (photo, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "category-photo";


      // ADMIN ДЭЭР "ТОМ ЗУРАГ"
      // СОНГОСОН БОЛ БҮТЭН ӨРГӨН

      if (photo.wide === true) {

        card.classList.add(
          "wide"
        );

      }


      // IMAGE

      const image =
        document.createElement(
          "img"
        );


      image.src =
        photo.imageUrl;


      image.alt =
        photo.title ||
        `${categoryName} - ${index + 1}`;


      image.loading =
        "lazy";


      image.decoding =
        "async";


      // IMAGE CLICK

      image.addEventListener(
        "click",
        () => {

          openImage(
            photo.imageUrl,
            photo.title ||
            "Дурсамж"
          );

        }
      );


      // ERROR

      image.addEventListener(
        "error",
        () => {

          card.classList.add(
            "image-error-card"
          );


          image.style.display =
            "none";


          const errorMessage =
            document.createElement(
              "div"
            );


          errorMessage.className =
            "photo-error";


          errorMessage.textContent =
            "Зураг ачаалж чадсангүй";


          card.prepend(
            errorMessage
          );

        },
        {
          once: true
        }
      );


      // CAPTION

      const caption =
        document.createElement(
          "p"
        );


      if (
        photo.title &&
        photo.title.trim()
      ) {

        caption.textContent =
          photo.title;

      } else {

        caption.textContent =
          `Дурсамж ${index + 1} ♡`;

      }


      card.appendChild(image);
      card.appendChild(caption);

      categoryPhotoGrid.appendChild(
        card
      );

    }
  );

}


// ======================================================
// BACK TO CATEGORY MENU
// ======================================================

if (backCategoriesBtn) {

  backCategoriesBtn.addEventListener(
    "click",
    () => {

      if (categoryGallery) {

        categoryGallery.classList.remove(
          "show"
        );

      }


      if (albumCategories) {

        albumCategories.classList.add(
          "show"
        );

      }


      scrollToAlbum();

    }
  );

}


// ======================================================
// SCROLL TO ALBUM
// ======================================================

function scrollToAlbum() {

  const albumSection =
    document.getElementById(
      "album"
    );


  if (!albumSection) {
    return;
  }


  setTimeout(
    () => {

      albumSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    50
  );

}


// ======================================================
// FALLING PETALS
// ======================================================

const petalSymbols = [
  "🌸",
  "❀",
  "✿"
];


function createPetal() {

  const petal =
    document.createElement(
      "div"
    );


  petal.className =
    "falling-petal";


  const randomPetal =
    petalSymbols[
      Math.floor(
        Math.random() *
        petalSymbols.length
      )
    ];


  petal.textContent =
    randomPetal;


  petal.style.left =
    Math.random() *
    100 +
    "vw";


  petal.style.fontSize =
    12 +
    Math.random() *
    12 +
    "px";


  petal.style.opacity =
    0.15 +
    Math.random() *
    0.3;


  petal.style.animationDuration =
    8 +
    Math.random() *
    6 +
    "s";


  document.body.appendChild(
    petal
  );


  setTimeout(
    () => {

      petal.remove();

    },
    15000
  );

}


// Хэт олон petal үүсгэхгүй

const petalInterval =
  setInterval(
    createPetal,
    1400
  );


// ======================================================
// PAGE VISIBILITY
// ======================================================

// Browser background tab болсон үед
// unnecessary animation бага ажиллуулна.

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden &&
      music &&
      musicPlaying
    ) {

      // Music-ийг зориуд зогсоохгүй.
      // Хэрэглэгч өөрөө control хийнэ.

    }

  }
);


// ======================================================
// READY
// ======================================================

console.log(
  "🌸 Teacher Day website ready"
);