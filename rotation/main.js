$(document).ready(function () {
    /** @type {HTMLCanvasElement} */
    // @ts-ignore
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");


    const ship = {
        x: canvas.width / 2 - 12,
        y: canvas.height / 2 - 12,
        width: 24,
        height: 24,
        velocity: 5,
        angle: 0,


        move: function () {
            this.x += Math.cos(this.angle) * this.velocity;
            this.y += Math.sin(this.angle) * this.velocity;
        },

        draw: function () {
            // save ctx state so we can restore after
            ctx.save();


            // move ctx to center of object
            // ctx rotates around (0,0) so we need to translate to the "pivot point" to rotate around
            ctx.translate(this.x - this.width / 2, this.y - this.height / 2);
            ctx.rotate(this.angle);


            // drawing triangle
            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.moveTo(0, this.height / 2);
            ctx.lineTo(-this.width / 2, -this.height / 2);
            ctx.lineTo(this.width / 2, -this.height / 2);
            ctx.fill();

            // drawing hitbox
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

            // draw pivot point
            ctx.fillStyle = "cyan";
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            // restore all ctx properties to what they were during last save
            ctx.restore();
        }
    };



    setInterval(() => {
        ship.angle += Math.PI / 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ship.move();
        ship.draw();

    }, 1000 / 60);
});