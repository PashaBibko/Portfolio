export class Vec2
{
    // The X and Y coordiantes of the vector //
    x: number;
    y: number;

    // Constructor //
    constructor(_x: number, _y: number)
    {
        this.x = _x;
        this.y = _y;
    }
}

export function CalculateSqrDist(v1: Vec2, v2: Vec2): number
{
    const a = (v1.x - v2.x) * (v1.x - v2.x);
    const b = (v1.y - v2.y) * (v1.y - v2.y);

    return Math.abs(a) + Math.abs(b);
}
