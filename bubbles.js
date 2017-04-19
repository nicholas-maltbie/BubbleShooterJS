//Game canvas and context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var rectangle = canvas.getBoundingClientRect();
var mouse = {};
var game_grid = null;

var game_colors = ['red', 'blue', 'green', 'orange', 'magenta'];

mouse.x = 0;
mouse.y = 0;
mouse.down = 0;
//setup mouse listener
canvas.addEventListener('mousemove', mouse_move, false)
canvas.addEventListener('mousedown', function(evt) {mouse.down = 1}, false)
canvas.addEventListener('mouseup', function(evt) {mouse.down = 0}, false)

var delay = 20 //delay between frames, 20 ms
//Get start time
var prev_time = new Date().getTime()

//List of all things to draw on the screen.
var game_objects = {}
var object_layers = {}
var layers = []
var added = 0

//Max elapsed time per frame
var max_elapsed = 25

//call setup function
setup()

function get_color()
{
  return game_colors[Math.floor(Math.random() * game_colors.length)];
}

//function to track mouse movement
function mouse_move(e)
{
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    mouse.x = x;
    mouse.y = y;
}

//Adds an object and returns the object's id
function add_object(object, layer=0)
{
    game_objects[added] = object
    object.id = added
    object.layer = layer;
    //check if the layer exists, if not create it
    if (!(layer in object_layers)) {
      object_layers[layer] = {}
      layers.push(layer);
      layers.sort()
    }
    //Add object to layer
    object_layers[layer][object.id] = 0
    added += 1
    return added
}

//Removes an object from the draw hash table
function remove_object(id)
{
    //find object layer and delete it from layer
    for (var index = 0; index < layers.length; index++) {
      layer = layers[index]
      if(id in object_layers[layer]) {
        delete object_layers[layer][id]
      }
    }
    //remove object from game_objects
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

    //iterate over the game objects and draw them all
    //start out at layer 0, then progress up
    layers.forEach( function(layer) {
      //get keys
      object_keys = Object.keys(object_layers[layer])
      for(var index = 0; index < object_keys.length; index++)
      {
          if (object_keys[index] in game_objects)
              game_objects[object_keys[index]].draw(elapsed)
      }
    })

    //update previous time
    prev_time = time
}

//This function will clear the canvas between frames
function clear()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//setup the scene
function setup()
{
    //add ball shooter
    var ball_shooter = new shooter(rectangle.width / 2, rectangle.height - 20, 10, 75, 200);
    add_object(ball_shooter)
    ball_shooter.load(get_color);
    canvas.addEventListener('click', function(event) {ball_shooter.fire(ball_shooter)}, false)

    //Create game grid
    var game_grid = new grid(22, 10, 1, 14, 10);
    //add game grid
    add_object(game_grid)
    //add a ball to the grid
    for(var i = 0; i < 4; i++)
        game_grid.add_row(get_color);

    var game_manager = new manager(ball_shooter, game_grid)
    add_object(game_manager, 10)
}

//set draw to every 20 ms
setInterval(draw, delay)
//draw()
