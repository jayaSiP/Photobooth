const leftCurtain = document.querySelector(".left-curtain");
const rightCurtain = document.querySelector(".right-curtain");
const startBtn = document.getElementById("start-btn");
const cameraSection = document.getElementById("camera-section");
const video = document.getElementById("video");
const captureBtn = document.getElementById("capture-btn");
const photosContainer = document.getElementById("photos");
const finalStrip = document.getElementById("final-strip");
const stripCanvas = document.getElementById("strip-canvas");
const ctx = stripCanvas.getContext("2d");

const reshootBtn = document.getElementById("reshoot-btn");
const downloadBtn = document.getElementById("download-strip-btn");

let capturedImages = [];

startBtn.addEventListener("click", () => {
  leftCurtain.classList.add("open");
  rightCurtain.classList.add("open");
  startBtn.style.display = "none";
  setTimeout(() => {
    cameraSection.style.display = "flex";
    startCamera();
  }, 1000);
});

function startCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      alert("Camera access denied.");
      console.error(err);
    });
}

// FILTER CONTROLS
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const selectedFilter = button.getAttribute("data-filter");
    video.style.filter = selectedFilter;
  });
});

// CAPTURE WITH TIMER
captureBtn.addEventListener("click", () => {
  captureBtn.disabled = true;
  captureBtn.textContent = "📷 3";

  let countdown = 2;
  const interval = setInterval(() => {
    captureBtn.textContent = `📷 ${countdown}`;
    countdown--;

    if (countdown < 0) {
      clearInterval(interval);
      captureBtn.textContent = "📷";
      captureBtn.disabled = false;
      capturePhoto();
    }
  }, 1000);
});

function capturePhoto() {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.filter = getComputedStyle(video).filter;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  let dataURL = canvas.toDataURL("image/png");
  capturedImages.push(dataURL);

  let photoDiv = document.createElement("div");
  photoDiv.classList.add("photo");

  let img = document.createElement("img");
  img.src = dataURL;
  photoDiv.appendChild(img);
  photosContainer.appendChild(photoDiv);

  if (capturedImages.length === 3) {
    video.style.display = "none";
    photosContainer.style.display = "none";
    captureBtn.disabled = true;
    createPhotoStrip();
  }
}

function createPhotoStrip() {
  const stripWidth = 200;
  const stripHeight = 600;
  stripCanvas.width = stripWidth;
  stripCanvas.height = stripHeight;

  let imgHeight = stripHeight / 3;

  const promises = capturedImages.map((src) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  });

  Promise.all(promises).then((images) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    images.forEach((img, index) => {
      let aspectRatio = img.width / img.height;
      let newHeight = imgHeight;
      let newWidth = aspectRatio * newHeight;
      let xOffset = (stripWidth - newWidth) / 2;
      ctx.drawImage(img, xOffset, imgHeight * index, newWidth, newHeight);
    });

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
   const today = new Date();
const formattedDate = today.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
ctx.fillText(`jaya.booth • ${formattedDate}`, 30, 590);


    finalStrip.style.display = "block";
    toggleUIForFinalStrip(true);
  });
}

function reshoot() {
  capturedImages = [];
  photosContainer.innerHTML = "";
  photosContainer.style.display = "grid";
  finalStrip.style.display = "none";
  captureBtn.disabled = false;
  video.style.display = "block";
  toggleUIForFinalStrip(false);
}

function toggleUIForFinalStrip(showFinal) {
  document.querySelector(".filters").style.display = showFinal
    ? "none"
    : "flex";
  captureBtn.style.display = showFinal ? "none" : "inline-block";
}

reshootBtn.addEventListener("click", reshoot);

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "photo_strip.png";
  link.href = stripCanvas.toDataURL();
  link.click();
});

function generateHearts() {
  const wrapper = document.querySelector('.wrapper');
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${4 + Math.random() * 3}s`;
    wrapper.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }, 500);
}

generateHearts();
