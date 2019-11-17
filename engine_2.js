var Game = function(width, height,bg, grid, grid_size) {
  document.getElementById("gra").style.width=width+"px";
  document.getElementById("gra").style.height=height+"px";
  this.width = width;
  this.height = height;
  this.bg = bg;

  this.lastUpdate = 0;
  this.running = false;

  this.grid = grid;
  this.grid_size = grid_size;

  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  canvas.id = 'Game_canvas';

  this.GUI = new Array();
  this.TextBoxes = new Array();

  this.SLEEPERS = new Array();

  document.getElementById('gra').appendChild(canvas);

  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.ctx.font = '18px bold \'courier new\'';

  this.show_keys = false;

  this.keyboard = {};
  this.keyboardC = {};
  this.lastKey = null;

  this.mouseBtn = {};
  this.mouseBtnC = {};
  this.m_x = 0;
  this.m_y = 0;
  this.m_lastKey = null;

  var self = this;
    
  window.addEventListener('keyup', function(e) {
    self.keyUp.call(self, e);
  }, false);

  window.addEventListener('keydown', function(e) {
    self.keyDown.call(self, e); 
  }, false);

  window.addEventListener("mousemove", function(e) {
    self.getMouseX.call(self, e);
  }, false);

  window.addEventListener("mousemove", function(e) {
    self.getMouseY.call(self, e);
  }, false);

  this.canvas.addEventListener("mousedown", function(e) {
    self.mouseDown.call(self, e);
  }, false);
  this.canvas.addEventListener("mouseup", function(e) {
    self.mouseUp.call(self, e);
  }, false);

  this.canvas.oncontextmenu = function (e) {
    e.preventDefault();
  };
};


Game.prototype.run = function() {
if(!this.running) {
  this.running = true;
  //IMPORTANT for keeping delta time
  this.lastUpdate = Date.now();
  var self = this;
  init();
  this.interval = setInterval(function() {
    self.loop.call(self);      
  }, 16.6667);
}
};

Game.prototype.loop = function() {
//IMPORTANT STUFF, I guess
  var now = Date.now();
  var dt = now - this.lastUpdate;
  this.lastUpdate = now;
 //...
  this._update(dt);
  this._draw(dt);
};

Game.prototype._update = function(dt) {
  update(dt);
};

Game.prototype._draw = function(dt) {
  this.ctx.fillStyle = this.bg;
  this.ctx.fillRect(0, 0, this.width, this.height);

  if(this.grid) {
    var hh = this.height/this.grid_size;
    var ww = this.width/this.grid_size;
    for(var i=0; i<ww; i++) {
      for(var j=0; j<hh; j++) {
        this.ctx.beginPath();
        this.ctx.rect(i*this.grid_size,j*this.grid_size,this.grid_size,this.grid_size);
        this.ctx.strokeStyle="black";
        this.ctx.stroke();
      }
    }
  }
  draw(dt);
  draw_GUI(dt);
};

function draw_GUI(dt) {
    for(var i=0; i < game.GUI.length; i++) {
      game.GUI[i].draw();
    }

    for(var i=0; i < game.TextBoxes.length; i++) {
      game.TextBoxes[i].draw();
    }
}

Game.prototype.keyUp = function(e) {
  this.lastKey = null;
  var keyCode = e.which ? e.which : e.keyCode;
  this.lastKey = keyCode;
  this.keyboard[keyCode] = false;
  this.keyboardC[keyCode] = false; 
};

Game.prototype.keyDown = function(e) {
  var keyCode = e.which ? e.which : e.keyCode;
  if(this.show_keys) { console.log(keyCode); }
  this.keyboard[keyCode] = true;
};

Game.prototype.getkeyDown = function(e) {
  var keyCode = e.which ? e.which : e.keyCode;
  return keyCode;
};
Game.prototype.mouseDown = function(e) {
  if ('object' === typeof e) {
    e.button;
    this.mouseBtn[e.button] = true;
  }
}

Game.prototype.mouseUp = function(e) {
  this.m_lastKey = null
  if ('object' === typeof e) {
    e.button;
    this.m_lastKey = e.button;
    this.mouseBtn[e.button] = false;
    this.mouseBtnC[e.button] = false; 
  }
}

Game.prototype.getMouseX = function(e) {
  var x = e.x;
  var rect = this.canvas.getBoundingClientRect();
  x -= rect.left;
  this.m_x = Math.floor(x);
}

Game.prototype.getMouseY = function(e) {
  var y = e.y;
  var rect = this.canvas.getBoundingClientRect();
  y -= rect.top
  this.m_y =  Math.floor(y);
}

/////////OBSŁUGA MYSZY I KLAWIATURY

function keyButton(e) {
 if(e=="any") {
    e = Object.getOwnPropertyNames(game.keyboard)[Object.values(game.keyboard).indexOf(true)];
  } 
  if(keyPressed(e) && game.keyboardC[e] === keyReleased(e)) {
    game.keyboardC[e] = true;
    return true;
  } else {
    return false;
  }
}


//keyPressed(e) gdzie e to przyciski klawiatury; zwraca nam prawdę dopóki przycisk jest wciśnięty
function keyPressed(e) {
 if(game.keyboard[e]===true) {
    game.lastKey = null;
    return true;
  } else {
    return false;
  }
}

//keyReleased(e) gdzie e to przyciski klawiatury; zwraca nam prawdę gdy przycisk jest puszczony
function keyReleased(e) {
  if(e == game.lastKey && !game.keyboard[e]) {
    game.lastKey = null;
    return true;
  } else {
    return false;
  }
}

function getlastkey() {
  return Object.getOwnPropertyNames(game.keyboard)[Object.values(game.keyboard).indexOf(true)];
}

//mouseButton(e) gdzie e to przyciski: 0 - lewy, 1 - środkowy, 2 - prawy; zwraca nam prawdę gdy następuje wcisniecie przycisku
function mouseButton(e) {
  if(mousePressed(e) && game.mouseBtnC[e] == mouseReleased(e)) {
    game.mouseBtnC[e] = true;
    return true;
  } else {
    return false;
  }
}



//mousePressed(e) gdzie e to przyciski: 0 - lewy, 1 - środkowy, 2 - prawy; zwraca nam prawdę dopóki przycisk jest wciśnięty
function mousePressed(e) {
  if(game.mouseBtn[e]===true) {
    game.m_lastKey = true;
    return true;
  } else {
    return false;
  }
}

//mouseReleased(e) gdzie e to przyciski: 0 - lewy, 1 - środkowy, 2 - prawy; zwraca nam prawdę gdy przycisk jest puszczony
function mouseReleased(e) {
  if(e == game.m_lastKey && !game.mouseBtn[e]) {
    game.m_lastKey = null;
    return true;
  } else {
    return false;
  }
}

///Mouse().x - zwraca nam x myszy, Mouse().y zwraca nam y myszy, Mouse() zwraca nam obiekt posiadający x i y
function Mouse() {
  var xx = 0;
  var yy = 0;
  if(game.m_x>0 && game.m_x < game.width && game.m_y > 0 && game.m_y < game.height) {
    return {x:game.m_x, y:game.m_y};
  } else {
    if(game.m_x > game.width) {
      xx = game.width;
    } else if(game._m_x < 0) {
      xx = 0;
    } else {
      xx = game.m_x;
    }

    if(game.m_y > game.height) {
      yy = game.height;
    } else if(game._m_y < 0) {
      yy = 0;
    } else {
      yy = game.m_y;
    }
    return {x:xx, y:yy};
  }
}

//mouse_over(object) gdzie object to objekt który posiada parametry x, y i size lub w i h; zwraca prawdę jeli mysz zanduje się na nim
function mouse_over(object) {
  var xx = object.x;
  var yy = object.y;
  if (typeof object.w === 'undefined' || object.w === null) {
    var width = object.size;
    var height = object.size;
  } else {
    var width = object.w;
    var height = object.h;
  }

  if(game.m_x > xx && game.m_x < xx+width && game.m_y > yy && game.m_y < yy+height) {
    return true;
  } else {
    return false;
  }
}

////////////////////////////////////////////////////////////////DRAW FUNCTIONS/////////////////////////////////////////////////////////////////////////

//drawSprite(spr, x, y, w, h) rysuje sprajta gdzie: spr - to zmienna typu img z przypisaną ścieżką, x i y - koordynaty, w - szerokosc, h-wysokosc
function drawSprite(spr, x, y, w, h) {
  game.ctx.drawImage(spr, x, y, w, h);
}

//drawFillRect(x,y,w,h,color) rysuje wypełniony prostokąt gdzie: x i y - koordynaty, w - szerokosc, h-wysokosc, color to kolor w zapisie przyjmowanym przez html
function drawFillRect(x,y,w,h,color) {
  game.ctx.fillStyle=color;
  game.ctx.fillRect(x*game.grid_size,y*game.grid_size,w,h);
}

//drawRect(x,y,w,h,color) rysuje obrys prostokątu gdzie: x i y - koordynaty, w - szerokosc, h-wysokosc, color to kolor w zapisie przyjmowanym przez html
function drawRect(x,y,w,h,color) {
  game.ctx.beginPath();
  game.ctx.strokeStyle=color;
  game.ctx.rect(x*game.grid_size,y*game.grid_size,w,h);
  game.ctx.stroke();
}

//setFont(size, font) size odpowiada za wielko 
function setFont(size, fontname) {
  game.ctx.font = size+"px "+fontname;
}

function drawText(text,x,y,color,align) {
  game.ctx.fillStyle = color;
  game.ctx.textAlign = align;
  game.ctx.fillText(text, x, y); 
  game.ctx.textBaseline="middle"; 
}

///GUI 
//new Button(x,y, width, height, text) - tworzy obiekt typu przycisku
var Button = function(x,y,w,h,text) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.text = text;
  this.clicked = false;
  game.GUI.push(this);
  //Rysowanie przycisku
  Button.prototype.draw = function() {
    if(!this.clicked) {
      drawFillRect(this.x,this.y,this.w,this.h,"grey");
    } else {
      drawFillRect(this.x,this.y,this.w,this.h,"lightgrey");
    }

    setFont(this.h/2, "Arial")
    drawText(this.text, this.x+this.w/2,this.y+this.h/2, "white", "center");
  }
 
  //Sprawdzanie czy przycisk został wcisnięty gdzie btn to numer klawisza myszki 
  Button.prototype.isClicked = function(btn) {
  if(!this.clicked) {
      if(mouse_over(this) && mouseButton(btn)) {
        this.clicked = true;
          return this.clicked
      } else {
        this.clicked = false;
         return this.clicked
      }
  } else if(mouseReleased(btn)) {
    this.clicked = false;
     return this.clicked
  }
}
};


//createTextBox(text,x,y,w,h,bordersize,speed) - tworzy textbox gdzie text - tekst który ma się pojawic, x/y to kordy, w - szerokosc, h - wysokosc, birdersize - szerokosc ramki, speed - szybkosc wypisywanego tesktu
function createTextBox(text,x,y,w,h,bordersize,speed) {
  var a = new TextBox(text,x, y, w, h, bordersize, speed)
  if(!game.TextBoxes.includes(game.TextBoxes[0])) {
    game.TextBoxes.push(a);
  }
}

var TextBox = function(text,x,y,w,h,bordersize,speed) {
   this.speed = speed;
  this.text = text;
  if(this.speed == 0) {
    this.visibleText = this.text;
  } else {
    this.visibleText = "";
  }
  this.x = x;
  this.y = y;
  this.w = w;
  this.ww = 0;
  this.h = h;
  this.hh = 0;
 
  this.bordersize = bordersize;
  this.bild = false;
  this.done = false;

  TextBox.prototype.draw = function() {
    if(!this.bild) {
      this.create();
    } else {
      if(!this.done) {
        if(mouse_over(this) && mouseButton(0)) {
              this.visibleText = this.text;
        }
      } else {
        if(mouse_over(this) && mouseButton(0)) {
          game.TextBoxes.splice(game.TextBoxes.findIndex(x => x.id === this),1);
        }
      }

    }
      this._draw();

  }

  TextBox.prototype._draw = function() {
    drawFillRect(this.x, this.y, this.ww, this.hh, "red");
    drawFillRect(this.x+this.bordersize, this.y+this.bordersize, this.ww-2*this.bordersize, this.hh-2*this.bordersize, "white");

    if(this.bild){
      if(sleep(this.text, 6*10)) {
        this.writeText();
      }
    }
    setFont(this.h/2 - this.text.length/2, "Arial");
    drawText(this.visibleText, this.x+this.w/2,this.y+this.h/2, "black", "center");
    if(this.done) {
      setFont(this.h/5, "Arial");
      drawText("kliknij na textbox żeby zniknął", this.x+this.w,this.y+this.h-this.bordersize*3, "grey", "right");
    }

  }

    TextBox.prototype.writeText = function() {
    if(this.visibleText.length != this.text.length) {
      this.visibleText += this.text.charAt(this.visibleText.length);
    } else {
      this.done = true;
    }
  }

  TextBox.prototype.create = function() {
    if(this.ww < this.w) {
      this.ww += 1*6*8;
    }

    if(this.hh < this.h) {
      this.hh += 1*6;
    }

    if(this.hh >= this.h && this.ww >= this.w) {
      this.bild = true;
    }
  }
};

//sleep(id, delay) opóźneinei wykonania kodu id- nazwa timera, delay - wartosc opoznienia podana w ms
function sleep(id, delay) {
  var start = new Date().getTime();
  var sleeper = new Sleeper(id, delay, start);
  this.deleted = false;
  var index = game.SLEEPERS.findIndex(x => x.id === id);
  if(index > -1) {
    if(game.SLEEPERS[index].done()) {
        game.SLEEPERS.splice(index, 1);
        return true;
    } else {
      return false;
    }
  } else {
    game.SLEEPERS.push(sleeper);
  }
}

var Sleeper = function(id, delay, start) {
  this.id = id;
  this.delay = delay;
  this.start = start;

  Sleeper.prototype.done = function() {
    if(new Date().getTime() > this.start + this.delay) {
      return true;
    } else {
      return false;
    }
  }
}

function log(text, delay) {
  if(delay==null) {
    delay = 0;
  }

  if(sleep("log", delay)) {
    console.log(text);
  }
}

function lArray(array, delay) {
  if(delay==null) {
    delay = 0;
  }

  if(sleep("lArray", delay)) {
    console.table(array);
  }
}
////TODO: 

//Dotyk
//Audio

//Kolejnosc rysowania
//kolizje
//reszta funkcji rysowania
//reszta systemow kolizji
//vektory

//sceny
//kamera