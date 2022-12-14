const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertToast("Please select an image");
    return;
  }

  // Get original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

// Send image data to main
function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertToast("Please upload an image");
    return;
  }

  if (width === "" || height === "") {
    alertToast("Please fill in a height and a width");
    return;
  }

  // Send to main using ipcRenderer
  ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height,
  });
}

// Catch the image:done event
ipcRenderer.on("image:done", () => {
  alertToast(
    `Image resized to ${widthInput.value} x ${heightInput.value}`,
    true
  );
});

// Make sure file is image
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];
  return file && acceptedImageTypes.includes(file["type"]);
}

function alertToast(message, isSuccess) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: isSuccess ? "green" : "red",
      color: "white",
      textAlign: "center",
    },
  });
}

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
