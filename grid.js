//function to make a grid
function grid(columns, ball_radius, gap, offx, offy)
{
    this.columns = columns
    this.offx = offx
    this.offy = offy
    this.rows = 0
    this.ball_radius = ball_radius
    this.ball_size = ball_radius * 2
    this.next_col = 0
    this.gap = gap
    this.balls = {}
    this.movement = 0
    this.critical_mass = 3; //min size of a group for the group to be deleted
                            //when a ball is added. Ex, if a ball is added and
                            //there are now at least 3 balls in the group, the
                            //gropu is removed from the grid.
    //values to save state of moving down
    this.target = 0         //how far should the balls move
    this.time = 0           //how long do the balls have to move there
    this.taken = 0          //how much time has elapsed since the balls started moving
    this.current_move = 0   //how far have the balls moved so far

    this.move_down = function (time, rows=1)
    {
        this.target = (this.ball_size + this.gap) * rows;
        this.time = time
    }

    this.intersect_grid = function (ball)
    {
        loc = this.get_pos(ball.x, ball.y)
        row = Math.round(loc[0])
        col = Math.round(loc[1])

        adj = this.get_adjacent(row, col)
        adj.push([row, col])
        for (index = 0; index < adj.length; index++)
        {
            loc = adj[index]
            if (this.in_grid(loc[0], loc[1]) && ball.intersect(this.balls[[loc[0], loc[1]]]))
            {
                adj.sort(this.make_comp(this, ball));
                for (index = 0; index < adj.length; index++)
                {
                    loc = adj[index]
                    if (!this.in_grid(loc[0], loc[1]))
                    {
                        this.thingy = false
                        this.insert_ball(ball, loc[0], loc[1])
                        return true
                    }
                }
            }
        }

        return false
    }

    this.make_comp = function(grid, ball) {
      return function(a, b){
        pos1 = grid.get_loc(a[0], a[1]);
        pos2 = grid.get_loc(b[0], b[1]);
        da = Math.sqrt((ball.x - pos1[0]) * (ball.x - pos1[0]) + (ball.y - pos1[1]) * (ball.y - pos1[1]));
        db = Math.sqrt((ball.x - pos2[0]) * (ball.x - pos2[0]) + (ball.y - pos2[1]) * (ball.y - pos2[1]));
        if (da == db)
          return 0;
        else if (da < db)
          return -1;
        else
          return 1;
      }
    }

    this.color_flood = function(row, col, color, group={}) {
      if(this.in_grid(row, col) && this.balls[[row, col]].color == color) {
        locs = [[row, col]];
        group[[row, col]] = 0
        adj = this.get_adjacent(row, col)
        for(var index = 0; index < adj.length; index++) {
          if(!([adj[index][0], adj[index][1]] in group)) {
            locs = locs.concat(this.color_flood(adj[index][0], adj[index][1], color, group))
          }
        }
        return locs;
      }
      else {
        return []
      }
    }

    //Draws the grid on the screen
    this.draw = function (elapsed)
    {
        if(this.time != 0)
        {
            dy = this.target / this.time * elapsed;
            if(this.taken + elapsed >= this.time)
            {
                dy = this.target - this.current_move
                this.target = 0;
                this.time = 0;
                this.taken = 0
                this.current_move = 0
            }
            else
            {
                this.current_move += dy
                this.taken += elapsed
            }
            this.translate_balls(0, dy)
            this.movement += dy
        }
    }

    //Gets the x and y pixels of a location
    this.get_loc = function (row, col)
    {
        x = this.gap + this.offx + (this.gap + this.ball_size) * col
        if (Math.abs(row) % 2 == 1)
            x += this.ball_size / 2;
        y = this.gap - (this.gap + this.ball_size) * (row) + this.offy + this.movement
        return [x, y]
    }

    //Gets a row, col location from pixels
    this.get_pos = function (x, y)
    {
        row = (y - this.gap - this.offy - this.movement) / -(this.gap + this.ball_size)
        col = (x - this.gap - this.offy) / (this.gap + this.ball_size)
        if (Math.abs(row) % 2 == 0)
            col = (x - this.gap - this.offy - this.ball_size / 2) / (this.gap + this.ball_size)
        return [row, col]
    }

    //Adds a single ball to the grid
    this.add_ball = function (color)
    {
        row = this.rows;
        col = this.next_col;
        [x, y] = this.get_loc(row, col)
        this.balls[[row, col]] = new ball(x, y, color, 0, 0, ball_radius);
        add_object(this.balls[[row, col]])
        this.next_col++;
        if(this.next_col >= this.columns)
        {
            this.rows ++;
            this.next_col = 0;
        }
    }

    //inserts a ball into the grid at a specific location
    this.insert_ball = function (ball, row, col)
    {
        loc = this.get_loc(row, col);
        ball.x = loc[0]
        ball.y = loc[1]
        ball.speedx = 0
        ball.speedy = 0
        this.balls[[row, col]] = ball

        //Get group of balls that this was added to
        group = this.color_flood(row, col, ball.color);
        //If the group has at least 3 balls in it, remove the balls from the grid
        if (group.length >= 3)
        {
            for(var index = 0; index < group.length; index++)
            {
                this.remove_ball(group[index][0], group[index][1])
            }
        }
    }

    //Removes a ball at a given row and column
    this.remove_ball = function (row, col)
    {
        if(this.in_grid(row, col))
        {
            remove_object(this.balls[[row,col]].id)
            delete this.balls[[row, col]]
            return true
        }
        return false
    }

    //Checks if there is a ball at a given location in the grid
    this.in_grid = function (row, col)
    {
        return [row, col] in this.balls
    }

    //Gets the adjacent locations to a spot on the grid as a list (with a hex layout)
    this.get_adjacent = function (row, col)
    {
        //(0,0) (0,1) (0,2)
        //  (1,0) (1,1) (1,2)
        //(2,0) (2,1) (2,2)
        //  (3,0) (3,1) (3,2)
        if (Math.abs(row) % 2 == 1)
        {
            return [[row - 1, col],
                    [row - 1, col + 1],
                    [row, col + 1],
                    [row, col - 1],
                    [row + 1, col],
                    [row + 1, col + 1]]
        }
        else
        {
            return [[row - 1, col - 1],
                    [row - 1,col],
                    [row, col + 1],
                    [row, col - 1],
                    [row + 1, col],
                    [row + 1, col - 1]]
        }
    }

    //Moves all the balls in a specific direction
    this.translate_balls = function (dx, dy)
    {
        ball_keys = Object.keys(this.balls)
        for(var index = 0; index < ball_keys.length; index++)
        {
            var ball = this.balls[ball_keys[index]]
            ball.x += dx;
            ball.y += dy;
        }
    }
}
