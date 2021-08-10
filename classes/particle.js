import { Vector } from "./vector.js";

export class Particle {

    /** @typedef {Object} ParticleArgs
     * @property [parent] {Particle}
     * @property [position] {Vector}
     * @property [size] {number}
     * @property [velocity] {Vector}
     * @property [angle] {number}
     * @property [color] {string}
     * @property [depth] {number}
     */

    /**
     * @param {ParticleArgs} args 
     */
    constructor(args) {
        if (!args) args = {};
        

        /** @type {Particle} */
        this.parent = args.parent instanceof Particle ? args.parent : null;
        this.position = args.position instanceof Vector ? args.position : new Vector(0,0);
        this.size = typeof args.size === "number" ? args.size : 10;
        this.velocity = args.velocity instanceof Vector ? args.velocity : new Vector(0, 1);
        this.angle = typeof args.angle === "number" ? args.angle : 0;
        this.color = typeof args.color === "string" ? args.color : "red";
        this.depth = typeof args.depth === "number" ? args.depth : 0;

        /** @type {Particle[]} */
        this.children = [];


        // decrement split timer each frame. once it reaches 0, split and reset 
        this.splitTimer = Particle.SPLIT_TIME;
        // once this exceeds MAX_SPLIT_COUNT, stop splitting
        this.splitCount = 0;

        this.tick = 0;

        //console.log("new particle: angle = " + this.angle);
    }


    /** @param {HTMLCanvasElement} canvas */
    move(canvas) {
        // bouncing off walls
        let p = this.position;
        let width = this.size / 2;
        if (p.x < width || p.x > canvas.width - width) {
            this.angle = Math.PI * 2 - this.angle;
            //particle.velocity.x *= -1;
        }
        if (p.y < width || p.y > canvas.height - width) {
            this.angle = Math.PI - this.angle;
            //console.log("FLIPPING: ", particle.angle);
            //particle.velocity.y *= -1
        }

        // TODO: do another bounds check and keep it within bounds?

        this.tick += Math.PI / 24;
        this.velocity.x += Math.cos(this.tick) / 5;
        this.velocity.y += Math.sin(this.tick) / 5;

        //console.log("move: " + this.angle);
        let delta = this.velocity.rotate(this.angle);
        this.position = this.position.add(delta);
        return delta;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
 
        this.move(ctx.canvas); //.multiply(100);

        ctx.beginPath();
        //ctx.moveTo(this.position.x - delta.x, this.position.y - delta.y);
        //ctx.lineTo(this.position.x, this.position.y);
        //ctx.stroke();
  

        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();


        this.children.forEach(c => c.draw(ctx));

        // stop splitting after 5 depth cus it freezes
        if (this.depth < Particle.MAX_SPLIT_DEPTH && this.splitCount < Particle.MAX_SPLIT_COUNT && --this.splitTimer < 0) {
            this.splitTimer = Particle.SPLIT_TIME;
            this.split();
        }
    }

    split() {
        this.splitCount++;

        let count = Math.random() * (Particle.MAX_CHILDREN - Particle.MIN_CHILDREN) + Particle.MIN_CHILDREN;
        let angle = 2 * Math.PI / count;
        let color = Particle.colors[Math.floor(Math.random() * Particle.colors.length)];

        for (var i = 0; i < count; i++) {
            let a = angle * (i + 0.5);
      
            let child = new Particle({
                parent: this,
                position: this.position.copy(),
                size: this.size * Particle.SCALE_MULTIPLIER,
                angle: a,
                depth: this.depth + 1,
                color: color
            });
            this.children.push(child);
            Particle.CurrentParticleCount++;
        }
    }
}

// these static properties can be changed by UI

Particle.SPLIT_TIME = 50;
Particle.MAX_SPLIT_COUNT = 4;
Particle.MAX_SPLIT_DEPTH = 2;
Particle.FPS = 60;

Particle.MIN_CHILDREN = 32;
Particle.MAX_CHILDREN = 32;
Particle.SCALE_MULTIPLIER = 0.5;
Particle.MAX_PARTICLE_COUNT = 100000;
Particle.CurrentParticleCount = 0;

//Particle.colors = ["red", "orange", "cyan"];
Particle.colors = ["red", "magenta", "cyan", "rgb(0,255,0)"];

