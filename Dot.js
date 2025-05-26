import { Vec2 } from "./Vec2.js";
function RandomFloat() {
    return Math.random() * 2 - 1;
}
export class FrontCanvasRenderDot {
    // Constructor to set a random location and velocity //
    constructor() {
        this.location = new Vec2(RandomFloat(), RandomFloat());
        this.velocity = new Vec2(RandomFloat(), RandomFloat());
    }
    // Updates the dot //
    Update(delta) {
        this.location.x = this.location.x + (this.velocity.x / 25.0 * delta);
        this.location.y = this.location.y + (this.velocity.y / 25.0 * delta);
        // Flips x-velocity if the x coord is outside [-1, 1] //
        if (this.location.x < -1 || 1 < this.location.x) {
            this.velocity.x = -this.velocity.x;
            // If it has gone too far out of bounds reset's the x position //
            if (this.location.x < -1.1 || 1.1 < this.location.x) {
                this.location.x = RandomFloat();
            }
        }
        // Flips y-velocity if the y coord is outside [-1, 1] //
        if (this.location.y < -1 || 1 < this.location.y) {
            this.velocity.y = -this.velocity.y;
            // If it has gone too far out of bounds reset's the y position //
            if (this.location.y < -1.1 || 1.1 < this.location.y) {
                this.location.y = RandomFloat();
            }
        }
    }
}
