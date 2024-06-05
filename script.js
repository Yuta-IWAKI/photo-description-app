const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let img = new Image();
let penColor = document.getElementById('colorPicker').value;
let paths = []; // 描画されたパスを保存する配列
let currentPath = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

canvas.addEventListener('touchstart', startDrawing, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('touchend', endDrawing, false);
canvas.addEventListener('touchcancel', endDrawing, false);

document.getElementById('colorPicker').addEventListener('input', (e) => {
    penColor = e.target.value;
});

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) * (canvas.width / rect.width),
        y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function getTouchPos(canvas, touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startDrawing(evt) {
    drawing = true;
    currentPath = [];
    let pos;
    if (evt.touches) {
        pos = getTouchPos(canvas, evt.touches[0]);
    } else {
        pos = getMousePos(canvas, evt);
    }
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    currentPath.push({ x: pos.x, y: pos.y, color: penColor });
    evt.preventDefault();
}

function draw(evt) {
    if (!drawing) return;
    let pos;
    if (evt.touches) {
        pos = getTouchPos(canvas, evt.touches[0]);
    } else {
        pos = getMousePos(canvas, evt);
    }
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    currentPath.push({ x: pos.x, y: pos.y, color: penColor });
    evt.preventDefault();
}

function endDrawing(evt) {
    if (!drawing) return;
    drawing = false;
    paths.push(currentPath);
    ctx.beginPath();
    evt.preventDefault();
}

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
