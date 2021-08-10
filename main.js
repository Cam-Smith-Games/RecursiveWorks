import { Vector } from "./classes/vector.js";
import { Particle} from "./classes/particle.js";





/** @type {Particle[]} */
let particles = [];

/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// TODO: min split count, max split count
// TODO: randomize colors?
// TODO: max number of splits

/** @type {number?} */
let interval = null;
let reset = () => {
    if (interval) {
        clearInterval(interval);
    }

    Particle.CurrentParticleCount = 0;

    // immediatley splitting particle and deleting it (only drawing children because having the root visible causes asymmetry)
    let particle = new Particle({ position: new Vector(canvas.width / 2, canvas.height / 2) });
    particle.split();
    particles = particle.children;
    particle = null;

    interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(c => c.draw(ctx));

        // remove particles that are off screen, add their childrne back to the root particle array
        //for (var i = particles.length - 1; i > -1; i--) {
            //let particle = particles[i];
            //let p = particle.position;
            //if (p.x < 0 || p.y < 0 || p.x > canvas.width || p.y > canvas.height) {
            //    particles.splice(i, 1);
            //    particles = particles.concat(particle.children);
            //}
        //}
        if (Particle.CurrentParticleCount > Particle.MAX_PARTICLE_COUNT) {
            alert("Maximum Particle Count Exceeded.");
            reset();
        }
    }, 1000 / Particle.FPS);
}


// defaulting in input values
$("input").each(function () {
    let field = $(this).data("field");
    // @ts-ignore
    $(this).val(Particle[field]);
});

$("input").on("change", function () {
    let val = Number($(this).val());
    if (isNaN(val)) {
        val = 0;
    }
    //val = parseFloat(val);

    let field = $(this).data("field");
    // @ts-ignore
    Particle[field] = val;

    $(this).val(val);

    if (field == "MIN_CHILDREN" || field == "MAX_CHILDREN") {
        if (Particle.MIN_CHILDREN > Particle.MAX_CHILDREN) {
            if (field == "MIN_CHILDREN") {
                Particle.MAX_CHILDREN = Particle.MIN_CHILDREN;
            } else {
                Particle.MIN_CHILDREN = Particle.MAX_CHILDREN;
            }    
        }
        
        $("input[data-field='MIN_CHILDREN']").val(Particle.MIN_CHILDREN);
        $("input[data-field='MAX_CHILDREN']").val(Particle.MAX_CHILDREN);
    }

    reset();
});

reset();

