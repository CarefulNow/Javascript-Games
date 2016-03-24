var animate = window.requestAnimationFrame ||
  	window.webkitRequestAnimationFrame ||
  	window.mozRequestAnimationFrame ||
  	function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = window.innerWidth;
var height = window.innerHeight;
var left = width/4;
var right = 2 * left;
var top = 100;
var bottom = 500;

canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

window.onload = function() {
  	document.body.appendChild(canvas);
  	animate(step);
};

var step = function() {
  	update();
  	render();
  	animate(step);
};

var update = function() {
	player.update();
	computer.update(ball);
  	ball.update(player.paddle, computer.paddle);
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(right, 300 + 50);

var render = function() {
  	context.fillStyle = "#000000";
  	context.fillRect(left, 100, right, 500);
  	player.render();
  	computer.render();
	ball.render();
};


function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function() {
  	context.fillStyle = "#FF0000";
  	context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(left, (300 + 25), 10, 50);
}

function Computer() {
  this.paddle = new Paddle((right + left - 10), (300 + 25), 10, 50);
}

Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
  if(diff < 0 && diff < -5) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 5) { // max speed right
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 100) {
    this.paddle.y = 100;
  } else if(this.paddle.y > 550) {
    this.paddle.y = 550;
  }
};

Player.prototype.render = function() {
  this.paddle.render();
};

Player.prototype.update = function() {
    for(var key in keysDown) {
   	    var value = Number(key);
        if(value == 68) { // left arrow
     		this.paddle.move(0, 5);
      	} else if (value == 65) { // right arrow
     	  	this.paddle.move(0, -5);
      	} else {
     		this.paddle.move(0, 0);
      	}
    }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 100) { // all the way to the left
    this.y = 100;
    this.y_speed = 0;
  } else if (this.y > 550) { // all the way to the right
    this.y = 550;
    this.y_speed = 0;
  }
}

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 5;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#d3d3d3";
  context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x > (left+right-paddle2.width)) {
  	if((this.y > paddle2.y) && (this.y < (paddle2.y + (paddle2.height)))) {
  		this.x_speed = -this.x_speed;
  		this.y_speed += (paddle2.y_speed * Math.random())/2;
  	}
  }

  if(this.x < (left+paddle1.width)) {
  	if((this.y > paddle1.y) && (this.y < (paddle1.y + (paddle1.height)))) {
  		this.x_speed = -this.x_speed;
  		this.y_speed += (paddle1.y_speed * Math.random())/2;
  	}
  }

  if((this.y - 5) < 100) {
  	this.y = 105;
  	this.y_speed = -this.y_speed;
  } else if((this.y + 5) > 600) {
  	this.y = 595;
  	this.y_speed = -this.y_speed;
  }

  if(this.x < left || this.x > (left + right)) {
    this.x_speed = 5;
    this.y_speed = 0;
    this.x = right;
    this.y = 350;
  }
};