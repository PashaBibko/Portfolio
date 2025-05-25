import { Vec2 } from "./Vec2.js";

function RandomFloat()
{
    return Math.random() * 2 - 1;
}

export class FrontCanvasRenderDot
{
    // The location and velocity of the dot //
    location: Vec2;
    velocity: Vec2;

    // Constructor to set a random location and velocity //
    constructor()
    {
        this.location = new Vec2(RandomFloat(), RandomFloat());
        this.velocity = new Vec2(RandomFloat(), RandomFloat());
    }
}
