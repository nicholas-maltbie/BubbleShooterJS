//define a game manager
function manager(ball_shooter, game_grid)
{
  this.ball_shooter = ball_shooter
  this.game_grid = game_grid
  this.reload = 0.5
  this.expand = 10
  this.wait = 0
  this.shots = 0

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
      if (this.wait == 0)
      {
        if(this.shots % this.expand == 0)
        {
          //this.game_grid.add_row(get_color)
        }
      }
      this.wait += elapsed;
      if (this.wait >= this.reload)
      {
        this.ball_shooter.load(get_color());
        this.wait = 0
        console.log(this.game_grid.get_all_colors())
      }
    }
  }
}
