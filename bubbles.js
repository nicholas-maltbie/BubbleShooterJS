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
    var date = new Date();
    var time = date.getTime();
    //calculate elapsed (in seconds)
    var elapsed = (time - prev_time) / 1000.0
    
    //get keys
    object_keys = Object.keys(game_objects);
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
function grid()
{
    this.rows = 0
    this.balls = {}  
    
    function add_row(balls)
    {
        for(var index = 0; index < balls.length; index++)
        {
            this.add_ball(balls[index], rows, col);
        }
        rows += 1;
    }
    
    function add_ball(ball, row, col)
    {
        this.balls[[row, col]] = ball
    }
    
    function in_grid(row, col)
    {
        return [row, col] in balls
    }
    
    function get_adjacent(row, col)
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
    
    function translate_balls(dx, dy)
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
    
}

//set draw to every 20 ms
setInterval(draw, delay)

