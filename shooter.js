//Define a shooter
function shooter(basex, basey, ball_size, arrow_length, fire_speed)
{
  this.basex = basex;
  this.basey = basey;
  this.ball_size = ball_size;
  this.arrow_length = arrow_length;
  this.min_angle = Math.PI / 24;
  this.max_angle = Math.PI * 23 / 24;
  this.fire_speed = fire_speed;
  this.added = null;
  this.fired = null
  this.angle = 0;
  this.can_fire = true

  this.fire = function(gun)
  {
    if (this.can_fire && gun.added != null) {
      gun.added.speedx = Math.cos(gun.angle) * gun.fire_speed;
      gun.added.speedy = Math.sin(gun.angle) * gun.fire_speed;
      gun.fired = gun.added;
      gun.added = null;
    }
  }

  this.load = function(color_fn)
  {
    this.added = new ball(this.basex, this.basey, color_fn(), 0, 0, this.ball_size);
    add_object(this.added);
  }

  this.draw = function(elapsed)
  {

    //draw an arrow for aiming
    dx = mouse.x - this.basex
    dy = mouse.y - this.basey
    length = Math.sqrt(dx * dx + dy * dy)
    angle = Math.atan2(dy, dx);

    //Bound angle
    if (-angle < this.min_angle || -angle > this.max_angle) {
      if (dx > 0) {
        angle = -this.min_angle;
      }
      else {
        angle = -this.max_angle;
      }
    }
    this.angle = angle;

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
