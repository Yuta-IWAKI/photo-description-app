const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let img = new Image();
let penColor = document.getElementById('colorPicker').value;
let paths = []; // 描画されたパスを保存する配列
let currentPath = [];

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    currentPath = [];
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentPath.push({ x: x, y: y, color: penColor });
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentPath.push({ x: x, y: y, color: penColor });
});

canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

function endDrawing() {
    if (!drawing) return;
    drawing = false;
    paths.push(currentPath);
    ctx.beginPath();
}

document.getElementById('colorPicker').addEventListener('input', (e) => {
    penColor = e.target.value;
});

document.getElementById('photoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            img.src = event.target.result;
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const maxWidth = 300; // キャンバスの最大幅
                const maxHeight = 500; // キャンバスの最大高さ
                if (aspectRatio > 1) { // 横長の画像
                    canvas.width = maxWidth;
                    canvas.height = maxWidth / aspectRatio;
                } else { // 縦長の画像
                    canvas.height = maxHeight;
                    canvas.width = maxHeight * aspectRatio;
                }
                if (canvas.height > maxHeight) {
                    canvas.height = maxHeight;
                    canvas.width = maxHeight * aspectRatio;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                redraw(); // 画像読み込み後に再描画
            };
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('undoButton').addEventListener('click', () => {
    paths.pop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img.src) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    redraw();
});

document.getElementById('downloadButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'download.png';
    link.click();
});

function redraw() {
    for (const path of paths) {
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            ctx.strokeStyle = path[i].color;
            if (i === 0) {
                ctx.moveTo(path[i].x, path[i].y);
            } else {
                ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
        }
        ctx.beginPath();
    }
}
