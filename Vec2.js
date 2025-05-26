export class Vec2 {
    // Constructor //
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
}
export function CalculateSqrDist(v1, v2) {
    const a = (v1.x - v2.x) * (v1.x - v2.x);
    const b = (v1.y - v2.y) * (v1.y - v2.y);
    return Math.abs(a) + Math.abs(b);
}
