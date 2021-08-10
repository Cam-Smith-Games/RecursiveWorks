export class Vector {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }


    /**
     * @param {number} angle 
     */
    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let x = (cos * this.x) - (sin * this.y);
        let y = (sin * this.x) + (cos * this.y);
        return new Vector(x,y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }


    /**
     * @param {Vector} vec 
     */
    add(vec) {
        if (vec instanceof Vector) {
            return new Vector(this.x + vec.x, this.y + vec.y);
        }
        return this;
    }


    /**
     * @param {number} scalar 
     */
    multiply(scalar) {
        if (typeof scalar === "number") {
            return new Vector(this.x * scalar, this.y * scalar);
        }
        return this;
    }
}