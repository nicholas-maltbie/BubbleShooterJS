//Define a shooter
function shooter(basex, basey, ball_size, arrow_length, fire_speed, color_fn)
{
  this.basex = basex;
  this.basey = basey;
  this.ball_size = ball_size;
  this.gap = 10;
  this.arrow_length = arrow_length;
  this.min_angle = Math.PI / 24;
  this.max_angle = Math.PI * 23 / 24;
  this.fire_speed = fire_speed;
  this.added = null;
  this.fired = null
  this.angle = 0;
  this.can_fire = true
  this.queue = []
  this.queue_length = 4
  this.loading = false
  this.load_vel = 100
  this.lost = false

  while(this.queue.length < this.queue_length)
  {
    var loaded = new ball(this.basex, this.basey, color_fn(), 0, 0, this.ball_size);
    this.queue.push(loaded);
    loaded.x = this.basex - (this.ball_size * 2 + this.gap) * (this.queue.length + 1)
    loaded.y = this.basey
    add_object(loaded);
  }

  this.fire = function(gun)
  {
    if (!this.lost && this.can_fire && gun.added != null) {
      gun.added.speedx = Math.cos(gun.angle) * gun.fire_speed;
      gun.added.speedy = Math.sin(gun.angle) * gun.fire_speed;
      gun.fired = gun.added;
      gun.added = null;
    }
  }

  this.load = function(color_fn)
  {
    this.added = this.queue.shift()

    while(this.queue.length < this.queue_length)
    {
      this.loading = true
      var loaded = new ball(this.basex, this.basey, color_fn(), 0, 0, this.ball_size);
      this.queue.push(loaded);
      loaded.x = this.basex - (this.ball_size * 2 + this.gap) * (this.queue.length + 1)
      loaded.y = this.basey
      add_object(loaded);
    }
  }

  this.draw = function(elapsed)
  {
    this.can_fire = true;
    if(this.loading == false) {
      if(this.added != null) {
        this.added.x = this.basex;
        this.added.y = this.basey;
      }
      for(var index = 0; index < this.queue.length; index++) {
        this.queue[index].x = this.basex - (this.ball_size * 2 + this.gap) * (index + 1)
        this.queue[index].y = this.basey
      }
    }
    else  {
      this.can_fire = false;
      if(this.added != null)
        this.added.speedx = this.load_vel;
      var vel = this.load_vel
      this.queue.forEach( function(b) {b.speedx = vel})
      if (this.added != null && this.added.x >= this.basex) {
        this.loading = false
      }
    }

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
    ctx.lineWidth = 3;
    //Draw main section of the arrow
    ctx.beginPath();
    ctx.moveTo(this.basex + 2, this.basey)
    ctx.lineTo(this.basex + 2 + lenx, this.basey + leny)
    ctx.stroke();
    ctx.closePath();
    //Draw two edge lines of the arrow
    ctx.beginPath();
    ctx.moveTo(this.basex + 2 + lenx, this.basey + leny)
    ctx.lineTo(this.basex + 2 + lenx - Math.cos(angle + Math.PI / 6) * arrow_length / 4
        , this.basey + leny - Math.sin(angle + Math.PI / 6) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(this.basex + 2 + lenx, this.basey + leny)
    ctx.lineTo(this.basex + 2 + lenx - Math.cos(angle - Math.PI / 6) * arrow_length / 4
        , this.basey + leny - Math.sin(angle - Math.PI / 6) * arrow_length / 4)
    ctx.stroke();
    ctx.closePath();
  }
}
