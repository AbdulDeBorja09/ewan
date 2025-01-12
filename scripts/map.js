const container = document.getElementById("svg-container");

fetch("src/map2.svg")
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
    let initialDistance = 0;
    let initialViewBox = { ...viewBox };

    let isRotating = false;
    let initialAngle = 0;
    let currentAngle = 0;

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

    const getDistance = (touch1, touch2) => {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getAngle = (touch1, touch2) => {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees
    };

    // Dragging with mouse
    svg.addEventListener("mousedown", (event) => {
      isDragging = true;
      startPoint = { x: event.clientX, y: event.clientY };
    });

    svg.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const dx =
          (startPoint.x - event.clientX) * (viewBox.width / svg.clientWidth);
        const dy =
          (startPoint.y - event.clientY) * (viewBox.height / svg.clientHeight);
        viewBox.x += dx;
        viewBox.y += dy;
        startPoint = { x: event.clientX, y: event.clientY };
        updateViewBox();
      }
    });

    svg.addEventListener("mouseup", () => {
      isDragging = false;
    });

    svg.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    // Mouse wheel zoom
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

    // Touch dragging, pinch-to-zoom, and rotation
    svg.addEventListener("touchstart", (event) => {
      if (event.touches.length === 1) {
        isDragging = true;
        startPoint = getTouchPoint(event);
      } else if (event.touches.length === 2) {
        isDragging = false;
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialAngle = getAngle(event.touches[0], event.touches[1]);
        initialViewBox = { ...viewBox };
      }
    });

    svg.addEventListener("touchmove", (event) => {
      event.preventDefault();
      if (event.touches.length === 1 && isDragging) {
        const touchPoint = getTouchPoint(event);
        const dx =
          (startPoint.x - touchPoint.x) * (viewBox.width / svg.clientWidth);
        const dy =
          (startPoint.y - touchPoint.y) * (viewBox.height / svg.clientHeight);
        viewBox.x += dx;
        viewBox.y += dy;
        startPoint = touchPoint;
        updateViewBox();
      } else if (event.touches.length === 2) {
        const newDistance = getDistance(event.touches[0], event.touches[1]);
        const zoomFactor = newDistance / initialDistance;

        const newAngle = getAngle(event.touches[0], event.touches[1]);
        const angleDelta = newAngle - initialAngle;

        const centerX =
          (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY =
          (event.touches[0].clientY + event.touches[1].clientY) / 2;

        svg.style.transformOrigin = `${centerX}px ${centerY}px`;
        svg.style.transform = `rotate(${
          currentAngle + angleDelta
        }deg) scale(${zoomFactor})`;
      }
    });

    svg.addEventListener("touchend", (event) => {
      if (event.touches.length === 0) {
        isDragging = false;
        currentAngle +=
          getAngle(event.touches[0], event.touches[1]) - initialAngle;
      }
    });

    updateViewBox();
  })
  .catch((error) => {
    console.error("Error loading the SVG file:", error);
  });
