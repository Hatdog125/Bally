const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', startGame);

function startGame() {
    startScreen.style.display = 'none';
    function animate() {
        console.log('innerWidth:', window.innerWidth, 'innerHeight:', window.innerHeight);
        if (window.innerHeight > window.innerWidth) {
            draw();
            update();
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.textAlign = "center";
            ctx.fillText("Rotate your device to portrait and restart the game", canvas.width / 2, canvas.height / 2);
        }
    }
    animate();
}


const radius = 50;
let x = canvas.width / 2;
let y = canvas.height / 2;
let vx = 0;
let vy = 0;
const g = 9.81 * 9.81;
const friction = 0.99;
let maxBounce = 0.9;
let isDragging = false;
let dragStartX;
let dragStartY;
let startBounce;

function draw() {
    ctx.clearRect(0,
        0,
        canvas.width,
        canvas.height);
    ctx.beginPath();
    ctx.arc(x,
        y,
        radius,
        0,
        Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (!isDragging) {
        vy += g / 60;
        vx *= friction;
        vy *= friction;
        x += vx;
        y += vy;

        if (x - radius < 0) {
            x = radius;
            vx = Math.abs(vx) * maxBounce;
        } else if (x + radius > canvas.width) {
            x = canvas.width - radius;
            vx = -Math.abs(vx) * maxBounce;
        }
        if (y - radius < 0) {
            y = radius;
            vy = Math.abs(vy) * maxBounce;
        } else if (y + radius > canvas.height) {
            y = canvas.height - radius;
            vy = -Math.abs(vy) * maxBounce;
        }


    }
}

canvas.addEventListener('touchstart', function(e) {
    if (Math.sqrt(Math.pow(e.touches[0].clientX - x, 2) + Math.pow(e.touches[0].clientY - y, 2)) < radius) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        vx = 0;
        vy = 0;
    }
});

canvas.addEventListener('touchmove',
    function(e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const touchX = e.changedTouches[0].clientX - rect.left;
            const touchY = e.changedTouches[0].clientY - rect.top;
            const throwForce = (dragStartY - touchY) / 10;
            vy = (touchY - y) / 10;
            vx = (touchX - x) / 10;
            x = Math.max(radius, Math.min(canvas.width - radius, touchX));
            y = Math.max(radius, Math.min(canvas.height - radius - radius, touchY));
            bounce = 0.8 + throwForce / 100;
        }
    });

canvas.addEventListener('touchend',
    function(e) {
        isDragging = false;
    });
