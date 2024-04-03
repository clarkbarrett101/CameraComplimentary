const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const path = new Path2D(
  "M172.7 19.27l-25.4 25.46L256 153.5 364.7 44.73l-25.4-25.46L256 102.5l-83.3-83.23zM44.73 147.3l-25.46 25.4L102.5 256l-83.23 83.3 25.46 25.4L153.5 256 44.73 147.3zm422.47 0L358.6 256l108.6 108.7 25.4-25.4-83.2-83.3 83.2-83.3-25.4-25.4zM256 358.5L147.3 467.3l25.4 25.4 83.3-83.2 83.3 83.2 25.4-25.4L256 358.5z"
);
const svg = document.getElementById("svg");
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function () {
        setInterval(processFrame, 100);
      };
    })
    .catch(function (err) {
      console.error("Access to webcam was denied", err);
    });
}
function processFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;
  const r = pixelData[0];
  const g = pixelData[1];
  const b = pixelData[2];
  let color = RGBToHSL(r, g, b);
  const gradient = ctx.createLinearGradient(0, centerY - 140, 0, centerY + 140);
  gradient.addColorStop(1, "black");
  gradient.addColorStop(0.5, complementaryHSL(color));
  gradient.addColorStop(0, "white");
  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 20;
  ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
  ctx.fill();
}
function RGBToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = 50;
  l = 50;
  return "hsl(" + h + "," + s + "%," + l + "%)";
}

function modifySVGColor(svgElement, originalColor, newColor) {
  const elements = svgElement.querySelectorAll("*");

  // Loop through each element
  elements.forEach((element) => {
    // Check if the element has the original color
    if (element.getAttribute("fill") === originalColor) {
      // Change the color to the new color
      element.setAttribute("fill", newColor);
    }
  });
}
function complementaryHSL(hsl) {
  const h = String(hsl).match(/\d+/g)[0];
  const newH = (parseInt(h) + 180) % 360;
  console.log(newH);
  return "hsl(" + newH + ",50%,50%)";
}

function mySvg(color) {
  /*
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      style="height: 200px; width: 200px;"
    >
      <defs>
        <clipPath id="icon-bg">
          <path
            d="M0 0h512v512H0z"
            fill="#000000"
            fill-opacity="0.02"
            transform="translate(537.6, 537.6) scale(-1.1, -1.1) rotate(-180, 256, 256) skewX(0) skewY(0)"
          ></path>
        </clipPath>
      </defs>
      <path d="M0 0h512v512H0z" fill="#000000" fill-opacity="0.00"></path>
      <g class="" transform="translate(3,-5)" style="">
        <path
          d="M172.7 19.27l-25.4 25.46L256 153.5 364.7 44.73l-25.4-25.46L256 102.5l-83.3-83.23zM44.73 147.3l-25.46 25.4L102.5 256l-83.23 83.3 25.46 25.4L153.5 256 44.73 147.3zm422.47 0L358.6 256l108.6 108.7 25.4-25.4-83.2-83.3 83.2-83.3-25.4-25.4zM256 358.5L147.3 467.3l25.4 25.4 83.3-83.2 83.3 83.2 25.4-25.4L256 358.5z"
          fill={color}
          fill-opacity="1"
          clip-path="url(#icon-bg)"
          transform="translate(486.4, 486.4) scale(-0.9, -0.9) rotate(-180, 256, 256) skewX(0) skewY(0)"
        ></path>
      </g>
    </svg>
  );
  */
}
