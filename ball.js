
//function to make a ball
function ball(x_start, y_start, color, speedx, speedy, radius)
{
    //Save values for ball
    this.x = x_start
    this.y = y_start
    this.speedx = speedx
    this.speedy = speedy
    this.color = color
    this.radius = radius

    //Check if two circles intersect
    this.intersect = function (circle)
    {
        dx = this.x - circle.x
        dy = this.y - circle.y
        rsum = this.radius + circle.radius
        return dx * dx + dy * dy <= rsum * rsum
    }

    this.draw = function (elapsed)
    {
        //Calculate movement across the x and y axis
        var dx = this.speedx * elapsed
        var dy = this.speedy * elapsed

        //If ball goes off the screen switch direction.
        if (dx + this.x + this.radius / 2 > canvas.width - this.radius ||
                dx + this.x - this.radius / 2 < this.radius) {
            this.speedx = -this.speedx
            dx = -dx
        }
        if (dy + this.y + this.radius / 2 > canvas.height -this.radius ||
                dy + this.y - this.radius / 2 < this.radius) {
            this.speedy = -this.speedy
            dy = -dy
        }

        //Move object based on dx and dy
        this.x += dx
        this.y += dy

        //Draw ball at its current location
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
}
