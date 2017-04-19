//define a game manager
function manager(ball_shooter, game_grid)
{
  this.ball_shooter = ball_shooter
  this.game_grid = game_grid
  this.reload = 0.5
  this.expand = 10
  this.min_expand = 5
  this.acceleration = 1
  this.wait = 0
  this.shots = 0
  this.lose = false
  this.lose_height = 14

  this.draw = function(elapsed) {
    //If a ball has been fired and is in motion
    if(this.ball_shooter.fired != null) {
      hitGrid = this.game_grid.intersect_grid(this.ball_shooter.fired);
      //If ball has been added to the grid
      if(hitGrid) {
        this.shots += 1
        this.ball_shooter.fired = null;
      }
    }

    //reload the ball shooter if elapsed time
    if (this.ball_shooter.added == null && this.ball_shooter.fired == null)
    {
      this.wait += elapsed;
      if (this.wait >= this.reload)
      {
        if(this.shots % this.expand == 0)
        {
          this.game_grid.add_row(get_color)
          this.shots = 0;
          this.expand -= this.acceleration;
          if (this.expand < this.min_expand) {
            this.expand = this.min_expand;
          }
        }
        this.ball_shooter.load(get_color);
        this.wait = 0
        if (game_grid.height() >= this.lose_height) {
          this.lose = true;
          this.ball_shooter.lost = true;
        }
      }
    }
    if(this.lose) {
      ctx.font = "45px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("You Lose", canvas.width/2, canvas.height/2);
      ctx.strokeText("You Lose", canvas.width/2, canvas.height/2);
    }
  }
}
