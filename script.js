document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('frutigerAeroCanvas');
    const ctx = canvas.getContext('2d', { alpha: true }); // Alpha true for transparency

    let width, height;
    let lines = [];

    // Optimization: Reduce number of lines
    const LINE_COUNT = 8;
    // Optimization: Increase step size for drawing curves
    const X_STEP = 15;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initLines();
    }

    window.addEventListener('resize', resize);

    class FlowingLine {
        constructor() {
            this.reset();
        }

        reset() {
            // Position: Mostly centered (20% - 80% of height)
            this.y = height * 0.2 + Math.random() * (height * 0.6);

            this.amplitude = 30 + Math.random() * 60;
            this.frequency = 0.001 + Math.random() * 0.002;
            this.phase = Math.random() * Math.PI * 2;

            this.speed = 0.0005 + Math.random() * 0.001;
            this.direction = Math.random() > 0.5 ? 1 : -1;

            this.width = 3 + Math.random() * 5;

            // Dynamic Color Properties
            // Start with a random cool hue (blue/cyan/green/purple range: 160-280)
            this.baseHue = 180 + Math.random() * 100;
            this.hue = this.baseHue;
            this.hueSpeed = 0.1 + Math.random() * 0.3;
            this.alpha = 0.1 + Math.random() * 0.3;
        }

        update() {
            this.phase += this.speed * this.direction;

            // Cycle hue slowly
            this.hue += this.hueSpeed;
            if (this.hue > 360) this.hue = 0;
        }

        draw() {
            ctx.beginPath();
            // Use HSLA for changing colors
            ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
            ctx.lineWidth = this.width;

            let y = 0;
            ctx.moveTo(0, this.y + Math.sin(this.phase) * this.amplitude);

            for (let x = 0; x <= width + X_STEP; x += X_STEP) {
                y = this.y + Math.sin(x * this.frequency + this.phase) * this.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    function initLines() {
        lines = [];
        for (let i = 0; i < LINE_COUNT; i++) {
            lines.push(new FlowingLine());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < lines.length; i++) {
            lines[i].update();
            lines[i].draw();
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
});
