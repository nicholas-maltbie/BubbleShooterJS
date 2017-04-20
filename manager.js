/* Copyright (c) 2016 Nicholas Maltbie
 * MIT License
 *
 * manager.js - game moderator file
 */

//define function for line object
function line(x1, y1, x2, y2, thickness, color) {
  this.draw = function() {
    //Draw death line
    ctx.strokeStyle = color
    ctx.lineWidth = thickness
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

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
  this.cycle = false
  this.score = 0
  this.pop_score_fn = function (pop) {return Math.floor(pop ** 1.5)}
  this.extra_score_fn = function (extra) {return extra}

  var death_height = (this.game_grid.ball_size + this.game_grid.gap) * (this.lose_height - 1) - game_grid.gap
  death_line = new line(0, death_height, canvas.width, death_height, 1, 'red')
  add_object(death_line, -1)

  this.draw = function(elapsed) {
    //If a ball has been fired and is in motion
    if(this.ball_shooter.fired != null)
    {
      [hitGrid, loc] = this.game_grid.intersect_grid(this.ball_shooter.fired);
      //If ball has been added to the grid
      if(hitGrid)
      {
        var pop = this.game_grid.insert_ball(this.ball_shooter.fired, loc[0], loc[1])
        if (pop > 0)
        {
          //verify the grid after removing balls
          var extra = this.game_grid.verify_grid()

          this.score += this.pop_score_fn(pop) + this.extra_score_fn(extra);
        }

        this.shots += 1
        this.ball_shooter.fired = null;
        this.ball_shooter.load(get_color);
        this.cycle = true
      }
    }

    //reload the ball shooter if elapsed time
    if (this.cycle)
    {
      this.wait += elapsed;
      if (this.wait >= this.reload)
      {
        this.cycle = false;
        if(this.shots % this.expand == 0)
        {
          this.game_grid.add_row(get_color)
          this.shots = 0;
          this.expand -= this.acceleration;
          if (this.expand < this.min_expand) {
            this.expand = this.min_expand;
          }
        }
        this.wait = 0
        if (game_grid.height() >= this.lose_height) {
          this.lose = true;
          this.ball_shooter.lost = true;
        }
      }
    }
    ctx.strokeStyle = 'black'

    if(this.lose) {
      var scoreText = "Score: " + this.score
      ctx.font = "65px Comic Sans MS";
      var loseWidth = ctx.measureText("You Lose").width
      ctx.font = "40px Comic Sans MS";
      var w = Math.max(loseWidth, ctx.measureText(scoreText).width)
      ctx.fillStyle = "#5874a0"
      ctx.globalAlpha = 0.88
      fillRoundRect(canvas.width / 2 - w / 2 - 10, canvas.height / 2 - 75, w + 20, 140, 10)
      ctx.globalAlpha = 1
      ctx.fillStyle = "black"
      roundRect(canvas.width / 2 - w / 2 - 10, canvas.height / 2 - 75, w + 20, 140, 10)
      ctx.lineWidth = 3
      ctx.font = "65px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("You Lose", canvas.width/2, canvas.height/2);
      ctx.strokeText("You Lose", canvas.width/2, canvas.height/2);
      ctx.lineWidth = 2
      ctx.font = "40px Comic Sans MS";
      ctx.fillText(scoreText, canvas.width / 2, canvas.height/2 + 40)
      ctx.strokeText(scoreText, canvas.width / 2, canvas.height/2 + 40)
    }
    else {
      ctx.lineWidth = 1
      ctx.font = "25px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "left"
      var scoreText = "Score: " + this.score
      var nextRow = "Next: " + (this.expand - this.shots)
      ctx.fillText(scoreText, canvas.width - ctx.measureText(scoreText).width - 10, canvas.height - 10)
      ctx.strokeText(scoreText, canvas.width - ctx.measureText(scoreText).width - 10, canvas.height - 10)
      ctx.fillText(nextRow, 10, canvas.height - 10)
      ctx.strokeText(nextRow, 10, canvas.height - 10)
    }
  }
}
