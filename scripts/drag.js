const bottomSheet = document.getElementById("bottomSheet");
const header = document.getElementById("header");

let startY,
  currentY,
  sheetHeight,
  isDragging = false;
const minHeight = 90;
const maxHeight = window.innerHeight * 0.5;

function getY(event) {
  if (event.touches) {
    return event.touches[0].clientY;
  }
  return event.clientY;
}

function startDrag(event) {
  isDragging = true;
  startY = getY(event);
  sheetHeight = bottomSheet.offsetHeight;
  bottomSheet.style.transition = "none";
  document.body.style.cursor = "grabbing";
  event.preventDefault(); 
}

function drag(event) {
  if (!isDragging) return;
  currentY = getY(event);
  const diff = startY - currentY;
  const newHeight = Math.min(
    Math.max(sheetHeight + diff, minHeight),
    maxHeight
  );
  bottomSheet.style.height = `${newHeight}px`;
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.cursor = "default";
  bottomSheet.style.transition = "height 0.3s ease";

  const currentHeight = bottomSheet.offsetHeight;
  if (currentHeight > (maxHeight + minHeight) / 2) {
    bottomSheet.style.height = `${maxHeight}px`;
  } else {
    bottomSheet.style.height = `${minHeight}px`;
  }
}

header.addEventListener("mousedown", startDrag);
header.addEventListener("touchstart", startDrag);

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag);

window.addEventListener("mouseup", endDrag);
window.addEventListener("touchend", endDrag);
