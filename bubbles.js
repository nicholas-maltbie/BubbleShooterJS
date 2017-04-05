//Game canvas and context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var delay = 20 //delay between frames, 20 ms
//Get start time
var prev_time = new Date().getTime()

//List of all things to draw on the screen.
var game_objects = {}
var added = 0

//call setup function
setup()

//Adds an object and returns the object's id
function add_object(object)
{
    game_objects[added] = object
    object.id = added
    added += 1
    return added
}

//Removes an object from the draw hash table
function remove_object(id)
{
    return delete game_objects[id]
}

//draw function
function draw()
{
    //clear canvas at start of frame
    clear();
    
    //get current time
    var date = new Date()
    var time = date.getTime()
    //calculate elapsed (in seconds)
    var elapsed = (time - prev_time) / 1000.0
    
    //get keys
    object_keys = Object.keys(game_objects)
    //iterate over the game objects and draw them all
    for(var index = 0; index < object_keys.length; index++)
    {
        game_objects[object_keys[index]].draw(elapsed)
    }
    
    //update previous time
    prev_time = time
}

//This function will clear the canvas between frames
function clear() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//function to make a ball
function ball(x, y, color, speedx, speedy, radius)
{
    //Save values for ball
    this.x = x
    this.y = y
    this.speedx = speedx
    this.speedy = speedy
    this.color = color
    this.radius = radius
    
    this.draw = function (elapsed)
    {
        //Calculate movement across the x and y axis
        var dx = this.speedx * elapsed
        var dy = this.speedy * elapsed
        
        //If ball goes off the screen switch direction.
        if (dx + this.x + this.radius / 2 > canvas.width || 
                dx + this.x - this.radius / 2 < 0) {
            this.speedx = -this.speedx
            dx = -dx
        }
        if (dy + this.y + this.radius / 2 > canvas.height ||
                dy + this.y - this.radius / 2 < 0) {
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
    
    this.move_down = function (time)
    {
        this.target = this.ball_size + this.gap;
        this.time = time
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
    
        //get balls
        ball_locs = Object.keys(this.balls)
        //iterate over the balls and draw them all
        for(var index = 0; index < ball_locs.length; index++)
        {
            this.balls[ball_locs[index]].draw(elapsed)
        }
    }
    
    //Adds a single ball to the grid
    this.add_ball = function (color)
    {
        row = this.rows;
        col = this.next_col;
        x = this.gap + (this.gap + this.ball_size) * col + this.offx;
        y = this.gap - (this.gap + this.ball_size * (row - 1) + this.offy) + this.movement;
        if (row % 2 == 0)
            x += this.ball_size / 2;
        this.balls[[row, col]] = new ball(x, y, color, 0, 0, ball_radius);
            
        this.next_col++;
        if(this.next_col >= this.columns)
        {
            this.rows ++;
            this.next_col = 0;
        }
    }
    
    //Checks if there is a ball at a given location in the grid
    this.in_grid = function (row, col)
    {
        return [row, col] in balls
    }
    
    //Gets the adjacent locations to a spot on the grid as a list (with a hex layout)
    this.get_adjacent = function (row, col)
    {
        //(0,0) (0,1) (0,2)
        //  (1,0) (1,1) (1,2)
        //(2,0) (2,1) (2,2)
        //  (3,0) (3,1) (3,2)
        if (row % 2 == 1)
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
                    [row - 1, col - 1]]
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

//setup the scene
function setup()
{
    //Get ball for game
    var thing = new ball(50, 50, "red", 100, 200, 10);
    //Add ball to scene
    add_object(thing)
    
    //Create game grid
    var game_grid = new grid(22, 10, 1, 14, 10);
    add_object(game_grid)
    //add a ball to the grid
    for(var i = 0; i < 44; i++)
        game_grid.add_ball("green");
    
    game_grid.move_down(0.1);
}

//set draw to every 20 ms
setInterval(draw, delay)
//draw()
