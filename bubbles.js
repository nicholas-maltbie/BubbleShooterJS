//Game canvas and context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var rectangle = canvas.getBoundingClientRect();
var mouse = {};
mouse.x = 0;
mouse.y = 1;
//setup mouse listener
canvas.addEventListener('mousemove', mouse_move, false)

var delay = 20 //delay between frames, 20 ms
//Get start time
var prev_time = new Date().getTime()

//List of all things to draw on the screen.
var game_objects = {}
var added = 0

//Max elapsed time per frame
var max_elapsed = 25

//call setup function
setup()

//function to track mouse movement
function mouse_move(e)
{
    var x = event.clientX - rectangle.left;
    var y = event.clientY - rectangle.top;
    mouse.x = x;
    mouse.y = y;
}

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
    elapsed = Math.min(elapsed, max_elapsed)

    //get keys
    object_keys = Object.keys(game_objects)
    //iterate over the game objects and draw them all
    for(var index = 0; index < object_keys.length; index++)
    {
        if (object_keys[index] in game_objects)
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

var thing = new ball(150, 150, "red", 500, -27, 10)
add_object(thing)
//setup the scene
function setup()
{
    //Get ball for game
    //Add ball to scene

    //add ball shooter
    var ball_shooter = new shooter(rectangle.width / 2, rectangle.height - 20, 10, 75);
    add_object(ball_shooter)

    //Create game grid
    var game_grid = new grid(22, 10, 1, 14, 10);
    add_object(game_grid)
    //add a ball to the grid
    for(var i = 0; i < 88; i++)
        game_grid.add_ball("blue");

    game_grid.move_down(3, 3);
}

//set draw to every 20 ms
setInterval(draw, delay)
//draw()
