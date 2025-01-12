const container = document.getElementById("svg-container");

// Load the external SVG file
fetch("src/map.svg")
  .then((response) => response.text())
  .then((svgContent) => {
    container.innerHTML = svgContent;

    const svg = container.querySelector("svg");

    if (!svg) {
      console.error("SVG not found in the loaded content.");
      return;
    }

    let viewBox = { x: 0, y: 0, width: 1000, height: 1000 }; // Default values
    const originalViewBox = svg.getAttribute("viewBox") || "0 0 1000 1000";
    [viewBox.x, viewBox.y, viewBox.width, viewBox.height] = originalViewBox
      .split(" ")
      .map(Number);

    let isDragging = false;
    let startPoint = { x: 0, y: 0 };

    const updateViewBox = () => {
      svg.setAttribute(
        "viewBox",
        `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
      );
    };

    const getTouchPoint = (event) => {
      const touch = event.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    };

    // Mouse Events
    svg.addEventListener("mousedown", (event) => {
      isDragging = true;
      startPoint = { x: event.clientX, y: event.clientY };
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      const dx =
        (startPoint.x - event.clientX) * (viewBox.width / svg.clientWidth);
      const dy =
        (startPoint.y - event.clientY) * (viewBox.height / svg.clientHeight);
      viewBox.x += dx;
      viewBox.y += dy;
      startPoint = { x: event.clientX, y: event.clientY };
      updateViewBox();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch Events
    svg.addEventListener("touchstart", (event) => {
      isDragging = true;
      startPoint = getTouchPoint(event);
    });

    svg.addEventListener("touchmove", (event) => {
      if (!isDragging) return;
      event.preventDefault(); // Prevent scrolling
      const touchPoint = getTouchPoint(event);
      const dx =
        (startPoint.x - touchPoint.x) * (viewBox.width / svg.clientWidth);
      const dy =
        (startPoint.y - touchPoint.y) * (viewBox.height / svg.clientHeight);
      viewBox.x += dx;
      viewBox.y += dy;
      startPoint = touchPoint;
      updateViewBox();
    });

    svg.addEventListener("touchend", () => {
      isDragging = false;
    });

    svg.addEventListener("wheel", (event) => {
      event.preventDefault();
      const zoomFactor = 1.1;
      const { clientX, clientY, deltaY } = event;
      const zoomIn = deltaY < 0;
      const zoomCenterX =
        (clientX / svg.clientWidth) * viewBox.width + viewBox.x;
      const zoomCenterY =
        (clientY / svg.clientHeight) * viewBox.height + viewBox.y;

      if (zoomIn) {
        viewBox.width /= zoomFactor;
        viewBox.height /= zoomFactor;
      } else {
        viewBox.width *= zoomFactor;
        viewBox.height *= zoomFactor;
      }

      viewBox.x = zoomCenterX - (clientX / svg.clientWidth) * viewBox.width;
      viewBox.y = zoomCenterY - (clientY / svg.clientHeight) * viewBox.height;

      updateViewBox();
    });

    // Initialize viewBox
    updateViewBox();
  })
  .catch((error) => {
    console.error("Error loading the SVG file:", error);
  });
