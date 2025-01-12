const bottomSheet = document.getElementById("bottomSheet");
const header = document.getElementById("header");

let startY,
  currentY,
  sheetHeight,
  isDragging = false;
const minHeight = 90;
const maxHeight = window.innerHeight * 0.5; 


header.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  sheetHeight = bottomSheet.offsetHeight;
  bottomSheet.style.transition = "none";
  document.body.style.cursor = "grabbing";
});


window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  currentY = e.clientY;
  const diff = startY - currentY;
  const newHeight = Math.min(
    Math.max(sheetHeight + diff, minHeight),
    maxHeight
  );
  bottomSheet.style.height = `${newHeight}px`;
});


window.addEventListener("mouseup", () => {
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
});