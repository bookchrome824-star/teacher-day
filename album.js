// ========================================
// ELEMENTS
// ========================================

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

const featuredCard =
  document.getElementById("featuredCard");


// STATS

const totalPhotos =
  document.getElementById("totalPhotos");

const totalAlbums =
  document.getElementById("totalAlbums");

const totalClasses =
  document.getElementById("totalClasses");

const totalMemories =
  document.getElementById("totalMemories");


// SLIDESHOW

const slideshow =
  document.getElementById("slideshow");

const slideImage =
  document.getElementById("slideImage");

const slideTitle =
  document.getElementById("slideTitle");

const slideCategory =
  document.getElementById("slideCategory");

const slideCurrent =
  document.getElementById("slideCurrent");

const slideTotal =
  document.getElementById("slideTotal");

const progressBar =
  document.getElementById("progressBar");

const playPauseBtn =
  document.getElementById("playPauseBtn");

const closeSlideshow =
  document.getElementById("closeSlideshow");

const previousSlide =
  document.getElementById("previousSlide");

const nextSlide =
  document.getElementById("nextSlide");

const heroSlideshowBtn =
  document.getElementById("heroSlideshowBtn");

const navSlideshowBtn =
  document.getElementById("navSlideshowBtn");

const categorySlideshowBtn =
  document.getElementById("categorySlideshowBtn");

const slideshowBackground =
  document.querySelector(".slideshow-background");


// ========================================
// DATA
// ========================================

const categoryNames = {

  events:
    "🎉 Баярын арга хэмжээ",

  awards:
    "🏆 Медаль, шагнал, тэмцээн уралдаан",

  travel:
    "🚌 Аялал",

  free:
    "📸 Чөлөөт зургууд"

};


let allPhotos = [];

let currentCategoryPhotos = [];

let currentCategory = null;


// slideshow

let slideshowPhotos = [];

let slideIndex = 0;

let slideshowTimer = null;

let slideshowPlaying = true;

const SLIDE_TIME = 1500;


// swipe

let touchStartX = 0;

let touchEndX = 0;


// ========================================
// START
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await Promise.all([
      loadStats(),
      loadAllPhotos()
    ]);

  }
);


// ========================================
// LOAD ALL PHOTOS
// ========================================

async function loadAllPhotos() {

  try {

    const response =
      await fetch(
        "/api/photos"
      );


    if (!response.ok) {

      throw new Error(
        "Зургуудыг авч чадсангүй."
      );

    }


    allPhotos =
      await response.json();


  } catch (error) {

    console.error(
      error
    );

    allPhotos = [];

  }

}


// ========================================
// STATS + FEATURED
// ========================================

async function loadStats() {

  try {

    const response =
      await fetch(
        "/api/album/stats"
      );


    if (!response.ok) {

      throw new Error(
        "Цомгийн мэдээлэл ачаалсангүй."
      );

    }


    const data =
      await response.json();


    animateNumber(
      totalPhotos,
      data.totalPhotos || 0
    );


    totalAlbums.textContent =
      data.totalAlbums ?? 4;


    totalClasses.textContent =
      data.totalClasses ?? 1;


    totalMemories.textContent =
      data.memories || "∞";


    if (data.categories) {

      Object.entries(
        data.categories
      ).forEach(
        ([category, count]) => {

          const element =
            document.querySelector(
              `[data-count="${category}"]`
            );


          if (element) {

            element.textContent =
              `${count} зураг`;

          }

        }
      );

    }


    renderFeatured(
      data.featured
    );


  } catch (error) {

    console.error(
      error
    );


    featuredCard.innerHTML = `
      <div class="featured-loading">
        Онцлох дурсамжийг ачаалж чадсангүй.
      </div>
    `;

  }

}


// ========================================
// NUMBER ANIMATION
// ========================================

function animateNumber(
  element,
  target
) {

  if (!element) {
    return;
  }


  const finalNumber =
    Number(target) || 0;


  if (finalNumber === 0) {

    element.textContent = "0";

    return;

  }


  let current = 0;


  const steps =
    Math.min(
      finalNumber,
      30
    );


  const increment =
    finalNumber /
    steps;


  const timer =
    setInterval(
      () => {

        current +=
          increment;


        if (
          current >=
          finalNumber
        ) {

          element.textContent =
            finalNumber;

          clearInterval(
            timer
          );

          return;

        }


        element.textContent =
          Math.floor(
            current
          );

      },
      35
    );

}


// ========================================
// FEATURED
// ========================================

function renderFeatured(photo) {

  if (!photo) {

    featuredCard.innerHTML = `
      <div class="featured-loading">

        <div>
          <div style="font-size:55px;margin-bottom:15px;">
            ⭐
          </div>

          Admin хэсгээс нэг зургийг
          онцлох дурсамжаар сонгоорой ♡
        </div>

      </div>
    `;

    return;

  }


  const title =
    photo.title?.trim()
      ? photo.title
      : "Бидний хамгийн нандин мөч ♡";


  featuredCard.innerHTML = `

    <img
      class="featured-image"
      src="${escapeAttribute(photo.imageUrl)}"
      alt="${escapeAttribute(title)}"
    >


    <div class="featured-overlay">

      <div class="featured-content">

        <p>
          ⭐ БИДНИЙ ОНЦЛОХ ДУРСАМЖ
        </p>

        <h3>
          ${escapeHtml(title)}
        </h3>

        <span>
          ${
            escapeHtml(
              categoryNames[
                photo.category
              ] || "10А анги"
            )
          }
        </span>

      </div>

    </div>
  `;


  const image =
    featuredCard.querySelector(
      ".featured-image"
    );


  image.addEventListener(
    "click",
    () => {

      openImage(
        photo.imageUrl,
        title
      );

    }
  );

}


// ========================================
// OPEN ALBUM
// ========================================

openAlbumBtn.addEventListener(
  "click",
  () => {

    categorySection.scrollIntoView({
      behavior: "smooth"
    });

  }
);


// ========================================
// CATEGORY BUTTONS
// ========================================

document
  .querySelectorAll(
    ".category-card"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const category =
            button.dataset.category;


          openCategory(
            category
          );

        }
      );

    }
  );


// ========================================
// OPEN CATEGORY
// ========================================

async function openCategory(
  category
) {

  currentCategory =
    category;


  galleryTitle.textContent =
    categoryNames[
      category
    ] || "Дурсамж";


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


    currentCategoryPhotos =
      await response.json();


    renderPhotos(
      currentCategoryPhotos
    );


  } catch (error) {

    currentCategoryPhotos =
      [];


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


// ========================================
// RENDER GALLERY
// ========================================

function renderPhotos(
  photos
) {

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
        document.createElement(
          "article"
        );


      card.className =
        "photo-card";


      if (photo.wide) {

        card.classList.add(
          "wide"
        );

      }


      const image =
        document.createElement(
          "img"
        );


      const title =
        photo.title?.trim()
          ? photo.title
          : `Дурсамж ${index + 1}`;


      image.src =
        photo.imageUrl;


      image.alt =
        title;


      image.loading =
        "lazy";


      image.addEventListener(
        "click",
        () => {

          openImage(
            photo.imageUrl,
            title
          );

        }
      );


      card.appendChild(
        image
      );


      if (
        photo.title &&
        photo.title.trim()
      ) {

        const caption =
          document.createElement(
            "div"
          );


        caption.className =
          "photo-caption";


        caption.textContent =
          photo.title;


        card.appendChild(
          caption
        );

      }


      if (
        photo.featured
      ) {

        const featured =
          document.createElement(
            "div"
          );


        featured.className =
          "photo-featured";


        featured.textContent =
          "⭐ ОНЦЛОХ ДУРСАМЖ";


        card.appendChild(
          featured
        );

      }


      photoGrid.appendChild(
        card
      );

    }
  );

}


// ========================================
// BACK
// ========================================

backBtn.addEventListener(
  "click",
  () => {

    gallerySection.classList.remove(
      "show"
    );


    categorySection.scrollIntoView({
      behavior: "smooth"
    });

  }
);


// ========================================
// IMAGE MODAL
// ========================================

function openImage(
  src,
  caption
) {

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
      event.target ===
      imageModal
    ) {

      closeImage();

    }

  }
);


// ========================================
// START ALL SLIDESHOW
// ========================================

heroSlideshowBtn.addEventListener(
  "click",
  () => {

    startSlideshow(
      allPhotos
    );

  }
);


navSlideshowBtn.addEventListener(
  "click",
  () => {

    startSlideshow(
      allPhotos
    );

  }
);


// ========================================
// CATEGORY SLIDESHOW
// ========================================

categorySlideshowBtn.addEventListener(
  "click",
  () => {

    startSlideshow(
      currentCategoryPhotos
    );

  }
);


// ========================================
// START SLIDESHOW
// ========================================

async function startSlideshow(
  photos
) {

  let list =
    Array.isArray(photos)
      ? photos
      : [];


  // allPhotos хараахан
  // ачаалагдаагүй байвал дахин авна

  if (!list.length) {

    await loadAllPhotos();


    list =
      currentCategory
        ? currentCategoryPhotos
        : allPhotos;

  }


  if (!list.length) {

    alert(
      "Slideshow үзүүлэх зураг алга байна."
    );

    return;

  }


  slideshowPhotos =
    [...list];


  slideIndex = 0;

  slideshowPlaying =
    true;


  slideshow.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";


  playPauseBtn.textContent =
    "❚❚ Түр зогсоох";


  showSlide(
    slideIndex
  );


  startAutoPlay();

}


// ========================================
// SHOW SLIDE
// ========================================

function showSlide(index) {

  if (
    !slideshowPhotos.length
  ) {

    return;

  }


  if (
    index >=
    slideshowPhotos.length
  ) {

    index = 0;

  }


  if (index < 0) {

    index =
      slideshowPhotos.length - 1;

  }


  slideIndex =
    index;


  const photo =
    slideshowPhotos[
      slideIndex
    ];


  const title =
    photo.title?.trim()
      ? photo.title
      : "Бидний дурсамж ♡";


  slideImage.classList.add(
    "changing"
  );


  setTimeout(
    () => {

      slideImage.src =
        photo.imageUrl;


      slideImage.alt =
        title;


      slideTitle.textContent =
        title;


      slideCategory.textContent =
        categoryNames[
          photo.category
        ] || "10А анги";


      slideCurrent.textContent =
        slideIndex + 1;


      slideTotal.textContent =
        slideshowPhotos.length;


      const progress =
        (
          (slideIndex + 1) /
          slideshowPhotos.length
        ) * 100;


      progressBar.style.width =
        `${progress}%`;


      slideshowBackground
        .style
        .backgroundImage =
          `url("${photo.imageUrl}")`;


      slideImage.classList.remove(
        "changing"
      );

    },
    180
  );

}


// ========================================
// NEXT / PREVIOUS
// ========================================

function goNext() {

  showSlide(
    slideIndex + 1
  );


  restartTimer();

}


function goPrevious() {

  showSlide(
    slideIndex - 1
  );


  restartTimer();

}


nextSlide.addEventListener(
  "click",
  goNext
);


previousSlide.addEventListener(
  "click",
  goPrevious
);


// ========================================
// AUTO PLAY
// ========================================

function startAutoPlay() {

  clearInterval(
    slideshowTimer
  );


  if (
    !slideshowPlaying
  ) {

    return;

  }


  slideshowTimer =
    setInterval(
      () => {

        showSlide(
          slideIndex + 1
        );

      },
      SLIDE_TIME
    );

}


function restartTimer() {

  if (
    slideshowPlaying
  ) {

    startAutoPlay();

  }

}


// ========================================
// PLAY / PAUSE
// ========================================

playPauseBtn.addEventListener(
  "click",
  () => {

    slideshowPlaying =
      !slideshowPlaying;


    if (
      slideshowPlaying
    ) {

      playPauseBtn.textContent =
        "❚❚ Түр зогсоох";


      startAutoPlay();

    } else {

      playPauseBtn.textContent =
        "▶ Үргэлжлүүлэх";


      clearInterval(
        slideshowTimer
      );

    }

  }
);


// ========================================
// CLOSE SLIDESHOW
// ========================================

function stopSlideshow() {

  clearInterval(
    slideshowTimer
  );


  slideshow.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";


  slideshowPhotos =
    [];

}


closeSlideshow.addEventListener(
  "click",
  stopSlideshow
);


// ========================================
// KEYBOARD
// ========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      slideshow.classList.contains(
        "show"
      )
    ) {

      if (
        event.key ===
        "ArrowRight"
      ) {

        goNext();

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        goPrevious();

      }


      if (
        event.key ===
        " "
      ) {

        event.preventDefault();

        playPauseBtn.click();

      }


      if (
        event.key ===
        "Escape"
      ) {

        stopSlideshow();

      }


      return;

    }


    if (
      event.key ===
      "Escape"
    ) {

      closeImage();

    }

  }
);


// ========================================
// MOBILE SWIPE
// ========================================

slideshow.addEventListener(
  "touchstart",
  (event) => {

    touchStartX =
      event.changedTouches[0]
        .screenX;

  },
  {
    passive: true
  }
);


slideshow.addEventListener(
  "touchend",
  (event) => {

    touchEndX =
      event.changedTouches[0]
        .screenX;


    handleSwipe();

  },
  {
    passive: true
  }
);


function handleSwipe() {

  const distance =
    touchStartX -
    touchEndX;


  if (
    Math.abs(distance) <
    50
  ) {

    return;

  }


  if (
    distance > 0
  ) {

    goNext();

  } else {

    goPrevious();

  }

}


// ========================================
// ESCAPE HELPERS
// ========================================

function escapeHtml(value) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(
      value ?? ""
    );


  return div.innerHTML;

}


function escapeAttribute(value) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    );

}

// ========================================
// LETTER
// ========================================

const envelope =
  document.getElementById("openLetterBtn");

const letterButton =
  document.getElementById("letterButton");

const teacherLetter =
  document.getElementById("teacherLetter");

const closeLetterBtn =
  document.getElementById("closeLetterBtn");


function openTeacherLetter() {

  envelope.classList.add("open");

  letterButton.textContent =
    "♡ Захидал нээгдлээ";


  setTimeout(() => {

    teacherLetter.classList.add("show");


    setTimeout(() => {

      teacherLetter.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 250);

  }, 550);

}


envelope.addEventListener(
  "click",
  openTeacherLetter
);


letterButton.addEventListener(
  "click",
  openTeacherLetter
);


closeLetterBtn.addEventListener(
  "click",
  () => {

    teacherLetter.classList.remove("show");

    envelope.classList.remove("open");

    letterButton.textContent =
      "💌 Захидлыг нээх";

  }
);


// ========================================
// MUSIC - AUTO PLAY + LOOP
// ========================================

const memoryMusic =
  document.getElementById("memoryMusic");

const musicButton =
  document.getElementById("musicButton");


// Дууны хэмжээ
memoryMusic.volume = 0.35;

// Дуу дуусмагц дахин эхэлнэ
memoryMusic.loop = true;


// ========================================
// START MUSIC
// ========================================

async function startMusic() {

  try {

    await memoryMusic.play();

    musicButton.classList.add(
      "playing"
    );

    musicButton.setAttribute(
      "aria-label",
      "Хөгжим зогсоох"
    );

  } catch (error) {

    console.log(
      "Autoplay blocked. First interaction дээр эхэлнэ."
    );

  }

}


// ========================================
// PAGE НЭЭГДЭХЭД ШУУД ТОГЛУУЛАХ
// ========================================

window.addEventListener(
  "load",
  () => {

    startMusic();

  }
);


// ========================================
// IPHONE / SAFARI / CHROME
// AUTOPLAY BLOCK ХИЙВЭЛ
// ЭХНИЙ TOUCH / CLICK ДЭЭР ТОГЛУУЛНА
// ========================================

async function startMusicOnFirstInteraction() {

  if (memoryMusic.paused) {

    await startMusic();

  }

  document.removeEventListener(
    "click",
    startMusicOnFirstInteraction
  );

  document.removeEventListener(
    "touchstart",
    startMusicOnFirstInteraction
  );

}


document.addEventListener(
  "click",
  startMusicOnFirstInteraction
);


document.addEventListener(
  "touchstart",
  startMusicOnFirstInteraction,
  {
    passive: true
  }
);


// ========================================
// MUSIC BUTTON
// ========================================

musicButton.addEventListener(
  "click",
  async (event) => {

    // document click event рүү дамжуулахгүй
    event.stopPropagation();

    try {

      if (memoryMusic.paused) {

        await startMusic();

      } else {

        memoryMusic.pause();

        musicButton.classList.remove(
          "playing"
        );

        musicButton.setAttribute(
          "aria-label",
          "Хөгжим тоглуулах"
        );

      }

    } catch (error) {

      console.error(
        "Music error:",
        error
      );

    }

  }
);


// ========================================
// MUSIC PLAY STATUS
// ========================================

memoryMusic.addEventListener(
  "play",
  () => {

    musicButton.classList.add(
      "playing"
    );

    musicButton.setAttribute(
      "aria-label",
      "Хөгжим зогсоох"
    );

  }
);


// ========================================
// MUSIC PAUSE STATUS
// ========================================

memoryMusic.addEventListener(
  "pause",
  () => {

    musicButton.classList.remove(
      "playing"
    );

    musicButton.setAttribute(
      "aria-label",
      "Хөгжим тоглуулах"
    );

  }
);


// ========================================
// НЭМЭЛТ LOOP ХАМГААЛАЛТ
// ========================================

memoryMusic.addEventListener(
  "ended",
  async () => {

    memoryMusic.currentTime = 0;

    try {

      await memoryMusic.play();

    } catch (error) {

      console.log(
        "Music restart blocked"
      );

    }

  }
);

// ========================================
// BACKGROUND MUSIC CONTROL
// ========================================

let musicWasPlaying = false;

document.addEventListener("visibilitychange", () => {

  if (document.hidden) {

    // Сайтаас гарахын өмнө тоглож байсан эсэх
    musicWasPlaying = !memoryMusic.paused;

    // Background болоход зогсооно
    memoryMusic.pause();

  } else {

    // Сайт руу буцаж орвол өмнө тоглож байсан
    // тохиолдолд үргэлжлүүлнэ
    if (musicWasPlaying) {
      memoryMusic.play().catch(() => {});
    }

  }

});


// iPhone / mobile browser нэмэлт хамгаалалт
window.addEventListener("pagehide", () => {
  musicWasPlaying = !memoryMusic.paused;
  memoryMusic.pause();
});

window.addEventListener("pageshow", () => {
  if (musicWasPlaying) {
    memoryMusic.play().catch(() => {});
  }
});