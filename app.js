// AR Coloring App Logic
// (Quiver-style: Color on 2D, see on 3D AR)

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const rangeInput = document.getElementById('penSize');
    const clearBtn = document.getElementById('clearBtn');
    
    // Set Canvas Internal Resolution - 1024x1024 for better texture quality
    const resolution = 1024;
    canvas.width = resolution;
    canvas.height = resolution;

    // Load User's Line Art
    const lineArt = new Image();
    lineArt.src = 'assets/line art.png';
    lineArt.onload = () => {
        // Fill with white first
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, resolution, resolution);
        // Draw the line art over it
        ctx.drawImage(lineArt, 0, 0, resolution, resolution);
        updateAFrameTexture();
    };
    
    // Fallback if image fails
    lineArt.onerror = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, resolution, resolution);
        ctx.fillStyle = '#f0f0f0';
        ctx.font = '40px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Line Art tidak ditemukan', resolution/2, resolution/2);
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
        // Notify A-Frame that the texture has changed
        updateAFrameTexture();
    }

    function draw(e) {
        if (!painting) return;
        
        ctx.lineWidth = currentWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;

        // Get coordinates relative to canvas displayed size
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        // Similarly for touch
        if (e.touches) {
            const touch = e.touches[0];
            const tx = (touch.clientX - rect.left) * (canvas.width / rect.width);
            const ty = (touch.clientY - rect.top) * (canvas.height / rect.height);
            ctx.lineTo(tx, ty);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.beginPath();
        if (e.touches) {
            const touch = e.touches[0];
            ctx.moveTo((touch.clientX - rect.left) * (canvas.width / rect.width), (touch.clientY - rect.top) * (canvas.height / rect.height));
        } else {
            ctx.moveTo(x, y);
        }
    }

    // A-Frame Texture Sync helper
    function updateAFrameTexture() {
        // Find the 3D model entity
        const modelEntity = document.querySelector('#coloredObject');
        if (modelEntity && modelEntity.getObject3D('mesh')) {
            const mesh = modelEntity.getObject3D('mesh');
            mesh.traverse((node) => {
                if (node.isMesh) {
                    // Update material map
                    if (node.material && node.material.map) {
                        node.material.map.needsUpdate = true;
                    }
                }
            });
        }
    }

    // Event Listeners for PC
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    
    // Event Listeners for Mobile
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', draw);

    // Color Swatches
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentColor = swatch.getAttribute('data-color');
            const picker = document.querySelector('.color-picker');
            if (picker) picker.value = currentColor;
        });
    });

    // Pen Size
    rangeInput.addEventListener('input', (e) => {
        currentWidth = e.target.value;
    });

    // Clear Canvas - Repaint white then line art
    clearBtn.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, resolution, resolution);
        if (lineArt.complete) {
            ctx.drawImage(lineArt, 0, 0, resolution, resolution);
        }
        updateAFrameTexture();
    });

    // Initialize - Map the canvas to the model when the model loads
    const scene = document.querySelector('a-scene');
    const initTexture = () => {
        const model = document.querySelector('#coloredObject');
        model.addEventListener('model-loaded', () => {
            const mesh = model.getObject3D('mesh');
            const texture = new THREE.CanvasTexture(canvas);
            
            mesh.traverse(node => {
                if (node.isMesh) {
                    node.material.map = texture;
                    node.material.needsUpdate = true;
                }
            });
            console.log("Texture Applied to Model!");
        });
    };

    if (scene.hasLoaded) initTexture(); else scene.addEventListener('loaded', initTexture);
});
