//Define a shooter
function shooter(basex, basey, ball_size, arrow_length)
{
  this.basex = basex;
  this.basey = basey;
  this.ball_size = ball_size;
  this.arrow_length = arrow_length;

  this.load = function(color)
  {

  }

  this.draw = function(elapsed)
  {

    //draw an arrow for aiming
    dx = mouse.x - this.basex
    dy = mouse.y - this.basey
    length = Math.sqrt(dx * dx + dy * dy)
    lenx = dx / length * this.arrow_length;
    leny = dy / length * this.arrow_length;
    angle = -Math.atan2(dx, dy);
    ctx.beginPath();
    ctx.moveTo(this.basex, this.basey)
    ctx.lineTo(this.basex + lenx, this.basey + leny)
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(this.basex + lenx, this.basey + leny)
    ctx.lineTo(this.basex + lenx - Math.cos(angle + Math.PI / 3) * arrow_length / 4
        , this.basey + leny - Math.sin(angle + Math.PI / 3) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(this.basex + lenx, this.basey + leny)
    ctx.lineTo(this.basex + lenx - Math.cos(angle + Math.PI * 2 / 3) * arrow_length / 4
        , this.basey + leny - Math.sin(angle + Math.PI * 2 / 3) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();
  }
}
