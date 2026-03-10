// Artest - High Performance Coloring Section
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const rangeInput = document.getElementById('penSize');
    const brushSizeDisplay = document.getElementById('brushSizeDisplay');
    const clearBtn = document.getElementById('clearBtn');
    const scanBtn = document.getElementById('scanBtn');
    const statusIndicator = document.getElementById('status-indicator');

    const resolution = 1024;
    canvas.width = resolution;
    canvas.height = resolution;

    // Load User's Line Art
    const lineArt = new Image();
    lineArt.src = 'assets/line art.png';
    lineArt.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, resolution, resolution);
        ctx.drawImage(lineArt, 0, 0, resolution, resolution);
        // Don't update texture yet, let use draw first
    };

    let painting = false;
    let currentColor = '#6366f1';
    let currentWidth = 15;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        
        ctx.lineWidth = currentWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            e.preventDefault();
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // A-Frame Texture Update
    function updateAFrameTexture() {
        const modelEntity = document.querySelector('#coloredObject');
        if (!modelEntity) return;

        const mesh = modelEntity.getObject3D('mesh');
        if (!mesh) return;

        // Visual feedback for scan
        scanBtn.innerText = "⏳ Scanning...";
        scanBtn.disabled = true;
        
        if (statusIndicator) {
            statusIndicator.innerText = "Processing colors...";
            statusIndicator.classList.remove('hidden');
        }

        setTimeout(() => {
            mesh.traverse((node) => {
                if (node.isMesh && node.material) {
                    const newTexture = new AFRAME.THREE.CanvasTexture(canvas);
                    newTexture.flipY = false;
                    node.material.map = newTexture;
                    node.material.needsUpdate = true;
                }
            });
            
            // Make visible after first scan
            modelEntity.setAttribute('visible', 'true');
            
            scanBtn.innerText = "Scan & Update 🚀";
            scanBtn.disabled = false;
            if (statusIndicator) statusIndicator.innerText = "Update Berhasil!";
        }, 1200);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', draw);

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentColor = swatch.getAttribute('data-color');
        });
    });

    rangeInput.addEventListener('input', (e) => {
        currentWidth = e.target.value;
        if (brushSizeDisplay) brushSizeDisplay.innerText = `${currentWidth}px`;
    });

    clearBtn.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, resolution, resolution);
        if (lineArt.complete) ctx.drawImage(lineArt, 0, 0, resolution, resolution);
    });

    scanBtn.addEventListener('click', updateAFrameTexture);

    // Initial load check
    const model = document.querySelector('#coloredObject');
    if (model) {
        // Hide initially until scan is clicked
        model.setAttribute('visible', 'false');
        
        model.addEventListener('model-loaded', () => {
            if (statusIndicator) statusIndicator.innerText = "Siap! Warnai & klik Scan";
        });
    }
});
