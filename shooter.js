//Define a shooter
function shooter(basex, basey, ball_size, arrow_length)
{
  this.basex = basex;
  this.basey = basey;
  this.ball_size = ball_size;
  this.arrow_length = arrow_length;
  this.min_angle = 0;
  this.max_angle = Math.PI;

  this.load = function(color)
  {

  }

  this.draw = function(elapsed)
  {

    //draw an arrow for aiming
    dx = mouse.x - this.basex
    dy = mouse.y - this.basey
    length = Math.sqrt(dx * dx + dy * dy)
    angle = Math.atan2(dy, dx);
    lenx = Math.cos(angle) * this.arrow_length;
    leny = Math.sin(angle) * this.arrow_length;
    //Draw main section of the arrow
    ctx.beginPath();
    ctx.moveTo(this.basex, this.basey)
    ctx.lineTo(this.basex + lenx, this.basey + leny)
    ctx.stroke();
    ctx.closePath();
    //Draw two edge lines of the arrow
    ctx.beginPath();
    ctx.moveTo(this.basex + lenx, this.basey + leny)
    ctx.lineTo(this.basex + lenx - Math.cos(angle + Math.PI / 6) * arrow_length / 4
        , this.basey + leny - Math.sin(angle + Math.PI / 6) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(this.basex + lenx, this.basey + leny)
    ctx.lineTo(this.basex + lenx - Math.cos(angle - Math.PI / 6) * arrow_length / 4
        , this.basey + leny - Math.sin(angle - Math.PI / 6) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();

  }
}
