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
        col = Math.floor(loc[1])
        adj = this.get_adjacent(row, col)
        adj.push([row, col])
        for (index = 0; index < adj.length; index++)
        {
            loc = adj[index]
            if (this.in_grid(loc[0], loc[1]) && ball.intersect(this.balls[[loc[0], loc[1]]]))
            {
                this.thingy = false
                this.insert_ball(ball, row, col)
                return true
            }
        }

        return false
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
        if (col < 0)
            col = 0
        else if(col >= this.columns)
            col = this.columns - 1;

        loc = this.get_loc(row, col);
        console.log(loc)
        ball.x = loc[0]
        ball.y = loc[1]
        ball.speedx = 0
        console.log(ball.speedx)
        ball.speedy = 0
        //console.log(row + " " + col + " " + "; " + x + " " + y + "; " + ball.x + " " + ball.y)
        this.balls[[row, col]] = ball
    }

    //Removes a ball at a given row and column
    this.remove_ball = function (row, col)
    {
        if(this.in_grid(row, col))
        {
            remove_object(balls[[row,col]].id)
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
