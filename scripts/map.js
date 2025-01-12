const container = document.getElementById('svg-container');
fetch('src/map.svg')
  .then(response => response.text())
  .then(svgContent => {
    container.innerHTML = svgContent;

    const svg = container.querySelector('svg');

    if (!svg) {
      console.error('SVG not found in the loaded content.');
      return;
    }

    let viewBox = { x: 0, y: 0, width: 1000, height: 1000 }; // Default values
    const originalViewBox = svg.getAttribute('viewBox') || '0 0 1000 1000';
    [viewBox.x, viewBox.y, viewBox.width, viewBox.height] = originalViewBox.split(' ').map(Number);

    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    const updateViewBox = () => {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    };

    svg.addEventListener('mousedown', (event) => {
      isPanning = true;
      startPoint = { x: event.clientX, y: event.clientY };
    });

    window.addEventListener('mousemove', (event) => {
      if (!isPanning) return;
      const dx = (startPoint.x - event.clientX) * (viewBox.width / svg.clientWidth);
      const dy = (startPoint.y - event.clientY) * (viewBox.height / svg.clientHeight);
      viewBox.x += dx;
      viewBox.y += dy;
      startPoint = { x: event.clientX, y: event.clientY };
      updateViewBox();
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
    });

    svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomFactor = 1.1;
      const { clientX, clientY, deltaY } = event;
      const zoomIn = deltaY < 0;
      const zoomCenterX = (clientX / svg.clientWidth) * viewBox.width + viewBox.x;
      const zoomCenterY = (clientY / svg.clientHeight) * viewBox.height + viewBox.y;

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
    updateViewBox();
  })
  .catch(error => {
    console.error('Error loading the SVG file:', error);
  });