// ==========================================
// ELEMENTS
// ==========================================

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


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealItems = document.querySelectorAll(".reveal");

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


// ==========================================
// SMOOTH NAVIGATION
// ==========================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


// ==========================================
// LETTER
// ==========================================

if (envelope) {

  envelope.addEventListener("click", () => {

    envelope.classList.toggle("open");

    if (envelope.classList.contains("open")) {

      openText.textContent =
        "Захидлыг хаахын тулд дахин дараарай ♡";

    } else {

      openText.textContent =
        "Дугтуйн дээр дараарай";

    }

  });

}


// ==========================================
// MUSIC
// ==========================================

let musicPlaying = false;

if (musicBtn && music) {

  musicBtn.addEventListener("click", async () => {

    try {

      if (!musicPlaying) {

        await music.play();

        musicPlaying = true;

        musicBtn.textContent =
          "❚❚ Зогсоох";

        musicBtn.classList.add("playing");

      } else {

        music.pause();

        musicPlaying = false;

        musicBtn.textContent =
          "♫ Ая";

        musicBtn.classList.remove("playing");

      }

    } catch (error) {

      alert(
        "music.mp3 файл project folder дотор байгаа эсэхийг шалгаарай."
      );

    }

  });

}


// ==========================================
// IMAGE MODAL
// ==========================================

function openImage(src, alt = "Дурсамж") {

  if (!imageModal || !modalImage) return;

  modalImage.src = src;
  modalImage.alt = alt;

  imageModal.classList.add("show");

  document.body.style.overflow = "hidden";

}


function closeImage() {

  if (!imageModal) return;

  imageModal.classList.remove("show");

  document.body.style.overflow = "";

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

      if (event.target === imageModal) {
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


// Багшийн зураг

const teacherPhoto =
  document.querySelector(".teacher-photo");

if (teacherPhoto) {

  teacherPhoto.addEventListener(
    "click",
    () => {

      openImage(
        teacherPhoto.src,
        teacherPhoto.alt
      );

    }
  );

}


// ==========================================
// ALBUM DATA
// ==========================================
//
// count = тухайн folder дотор хэдэн зураг
// байгааг заана.
//
// wide = аль зураг бүтэн өргөнөөр
// харагдахыг заана.
//
// Жишээ:
// wide: [1, 4]
//
// photo1 болон photo4 том гарна.
// ==========================================

const albumData = {

  events: {

    title: "🎉 Баярын арга хэмжээ",

    folder: "events",

    count: 6,

    wide: [1, 4]

  },


  awards: {

    title: "🏆 Медаль, шагнал, тэмцээн",

    folder: "awards",

    count: 6,

    wide: [1]

  },


  travel: {

    title: "🚌 Аялал",

    folder: "travel",

    count: 6,

    wide: [1, 4]

  },


  free: {

    title: "📸 Чөлөөт зургууд",

    folder: "free",

    count: 6,

    wide: []

  }

};


// ==========================================
// OPEN ALBUM
// ==========================================

if (openAlbumBtn) {

  openAlbumBtn.addEventListener(
    "click",
    () => {

      albumHome.classList.add("hide");

      albumCategories.classList.add("show");

    }
  );

}


// ==========================================
// CLOSE ALBUM
// ==========================================

if (closeAlbumBtn) {

  closeAlbumBtn.addEventListener(
    "click",
    () => {

      albumCategories.classList.remove(
        "show"
      );

      albumHome.classList.remove(
        "hide"
      );

    }
  );

}


// ==========================================
// CATEGORY BUTTONS
// ==========================================

const categoryButtons =
  document.querySelectorAll(
    ".category-card"
  );


categoryButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const category =
        button.dataset.category;

      openCategory(category);

    }
  );

});


// ==========================================
// OPEN CATEGORY
// ==========================================

function openCategory(category) {

  const data = albumData[category];

  if (!data) return;


  categoryTitle.textContent =
    data.title;


  categoryPhotoGrid.innerHTML =
    "";


  for (
    let i = 1;
    i <= data.count;
    i++
  ) {

    // CARD

    const card =
      document.createElement("div");

    card.className =
      "category-photo";


    // Том зураг эсэх

    if (data.wide.includes(i)) {

      card.classList.add("wide");

    }


    // IMAGE

    const image =
      document.createElement("img");


    image.src =
      `images/album/${data.folder}/photo${i}.jpg`;


    image.alt =
      `${data.title} - зураг ${i}`;


    image.loading =
      "lazy";


    // CAPTION

    const caption =
      document.createElement("p");


    caption.textContent =
      `Дурсамж ${i} ♡`;


    // ЗУРАГ ОЛДОХГҮЙ БОЛ CARD-ЫГ НУУНА

    image.addEventListener(
      "error",
      () => {

        card.style.display =
          "none";

      }
    );


    // FULLSCREEN

    image.addEventListener(
      "click",
      () => {

        openImage(
          image.src,
          image.alt
        );

      }
    );


    card.appendChild(image);

    card.appendChild(caption);

    categoryPhotoGrid.appendChild(card);

  }


  albumCategories.classList.remove(
    "show"
  );


  categoryGallery.classList.add(
    "show"
  );


  document
    .getElementById("album")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}


// ==========================================
// BACK TO CATEGORIES
// ==========================================

if (backCategoriesBtn) {

  backCategoriesBtn.addEventListener(
    "click",
    () => {

      categoryGallery.classList.remove(
        "show"
      );

      albumCategories.classList.add(
        "show"
      );

      document
        .getElementById("album")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }
  );

}


// ==========================================
// PETALS
// ==========================================

const petalSymbols = [
  "🌸",
  "❀",
  "✿"
];


function createPetal() {

  const petal =
    document.createElement("div");


  petal.className =
    "falling-petal";


  petal.textContent =
    petalSymbols[
      Math.floor(
        Math.random() *
        petalSymbols.length
      )
    ];


  petal.style.left =
    Math.random() * 100 + "vw";


  petal.style.fontSize =
    12 +
    Math.random() * 12 +
    "px";


  petal.style.opacity =
    0.15 +
    Math.random() * 0.3;


  petal.style.animationDuration =
    8 +
    Math.random() * 6 +
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


setInterval(
  createPetal,
  1300
);