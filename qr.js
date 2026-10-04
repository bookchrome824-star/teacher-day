const bouquet =
  document.getElementById("bouquet");

const flowers =
  document.getElementById("flowers");

const bloomBtn =
  document.getElementById("bloomBtn");

const finalMessage =
  document.getElementById("finalMessage");


const ALBUM_URL =
  "https://teacher-day-7s0i.onrender.com/album.html";


/* ========================================
   QR
======================================== */

new QRCode(
  document.getElementById("qrcode"),
  {
    text: ALBUM_URL,

    width: 250,
    height: 250,

    colorDark: "#713844",
    colorLight: "#ffffff",

    correctLevel:
      QRCode.CorrectLevel.H
  }
);


/* ========================================
   CREATE FLOWER BOUQUET
======================================== */

const flowerTypes = [
  "🌸",
  "🌺",
  "🌷",
  "🌹"
];


const flowerData = [];


for (let i = 0; i < 55; i++) {

  const flower =
    document.createElement("span");

  flower.className =
    "flower";


  flower.textContent =
    flowerTypes[
      Math.floor(
        Math.random() *
        flowerTypes.length
      )
    ];


  // Баглаа хэлбэртэй байрлал
  const angle =
    Math.random() *
    Math.PI *
    2;

  const radius =
    Math.sqrt(Math.random()) *
    165;


  const x =
    215 +
    Math.cos(angle) *
    radius;

  const y =
    200 +
    Math.sin(angle) *
    radius *
    .82;


  flower.style.left =
    `${x - 32}px`;

  flower.style.top =
    `${y - 32}px`;


  const scale =
    .65 +
    Math.random() *
    .55;


  const rotate =
    -20 +
    Math.random() *
    40;


  flower.style.transform =
    `scale(${scale})
     rotate(${rotate}deg)`;


  flowers.appendChild(
    flower
  );


  flowerData.push({
    element: flower,
    angle,
    scale,
    rotate
  });

}


/* ========================================
   BLOOM
======================================== */

let opened = false;


function bloomBouquet() {

  if (opened) {
    return;
  }

  opened = true;


  bouquet.classList.add(
    "open"
  );


  flowerData.forEach(
    (item, index) => {

      const distance =
        300 +
        Math.random() *
        220;


      const moveX =
        Math.cos(item.angle) *
        distance;

      const moveY =
        Math.sin(item.angle) *
        distance;


      setTimeout(
        () => {

          item.element.style.transform =
            `
            translate(
              ${moveX}px,
              ${moveY}px
            )
            rotate(
              ${item.rotate + 180}deg
            )
            scale(${item.scale * .65})
            `;

          item.element.style.opacity =
            ".25";

        },
        index * 8
      );

    }
  );


  setTimeout(
    () => {

      finalMessage.classList.add(
        "show"
      );

    },
    900
  );

}


/* BUTTON */

bloomBtn.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

    bloomBouquet();

  }
);


/* БАГЛААН ДЭЭР ДАРЖ БОЛНО */

bouquet.addEventListener(
  "click",
  () => {

    bloomBouquet();

  }
);