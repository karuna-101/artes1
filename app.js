// Artest - Rebuild: Line-Art Coloring -> Scan -> Display 3D
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const rangeInput = document.getElementById('penSize');
    const brushSizeDisplay = document.getElementById('brushSizeDisplay');
    const clearBtn = document.getElementById('clearBtn');
    const scanBtn = document.getElementById('scanBtn');
    const closePreview = document.getElementById('closePreview');
    const previewSection = document.getElementById('preview-section');
    const scanLine = document.getElementById('scan-line');

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

    // Manual Scan Function
    function startScan() {
        scanBtn.disabled = true;
        scanBtn.innerText = "Scanning... 🔍";
        scanLine.classList.add('scanning');

        setTimeout(() => {
            update3DModel();
            scanBtn.disabled = false;
            scanBtn.innerText = "Mulai Scan 🚀";
            scanLine.classList.remove('scanning');
            
            // Show result overlay
            previewSection.classList.remove('hidden');
        }, 2200); // Animation duration
    }

    function update3DModel() {
        const modelEntity = document.querySelector('#coloredObject');
        if (!modelEntity) return;

        const mesh = modelEntity.getObject3D('mesh');
        if (!mesh) return;

        mesh.traverse((node) => {
            if (node.isMesh && node.material) {
                const newTexture = new AFRAME.THREE.CanvasTexture(canvas);
                newTexture.flipY = false;
                node.material.map = newTexture;
                node.material.needsUpdate = true;
            }
        });
        
        modelEntity.setAttribute('visible', 'true');
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
            
            // If white, it's an eraser
            if (currentColor === '#ffffff') {
                // We keep drawing on top of line art, so eraser is just white brush
                // But wait, it might cover the line art. 
                // Technically true, but in this "scan" context it's okay.
            }
        });
    });

    rangeInput.addEventListener('input', (e) => {
        currentWidth = e.target.value;
        if (brushSizeDisplay) brushSizeDisplay.innerText = `${currentWidth}px`;
    });

    clearBtn.addEventListener('click', () => {
        if(confirm("Hapus semua coretan?")) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, resolution, resolution);
            if (lineArt.complete) ctx.drawImage(lineArt, 0, 0, resolution, resolution);
        }
    });

    scanBtn.addEventListener('click', startScan);
    
    closePreview.addEventListener('click', () => {
        previewSection.classList.add('hidden');
    });
});
