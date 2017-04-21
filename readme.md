# Bubble Shooter js

This is an attempt to implement the game bubble shooter in JS. This is one of
my first projects in js so it probably won't be stellar in style.

This uses the canvas element to draw shapes on the screen and create the game.

Doc.html can be used to view the game.

The bubble.js file uses a canvas with the id "myCanvas"

The game is currently hosted live to play on [my website](https://nicholas-maltbie.github.io/bubble.html).

### Can I Use This Game? ###

To add the game to your website, add the following statement to the html page.

```HTML
<div align='center'>
  <link rel="stylesheet" type="text/css"
    href="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/bubblestyle.css">
  </link>
  <canvas id="game-canvas" style='maring:0 auto; background: #eee' width="480" height="320"></canvas>
  <script type='application/javascript'
    src="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/grid.js">
  </script>
  <script type='application/javascript'
    src="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/ball.js">
  </script>
  <script type='application/javascript'
    src="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/shooter.js">
  </script>
  <script type='application/javascript'
    src="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/manager.js">
  </script>
  <script type='application/javascript'
    src="https://rawgit.com/nicholas-maltbie/BubbleShooterJS/master/bubbles.js">
  </script>
</div>
```

To see an example of this, look at the game imported on [my website](https://nicholas-maltbie.github.io/bubble.html).

### Copyright ###
This code is under the MIT License Copyright (c) 2017 Nicholas Maltbie

See LICENSE.txt for further details
