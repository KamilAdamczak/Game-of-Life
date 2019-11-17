
//INIT ENGINE////////

var grid_size = 3;
const game = new Game(1080, 650, "white", false, grid_size);
game.run();

var cam =  {
	x : -100,
	y : -7,
	w : 720,
	h: 480,
	spd : .08
}

var tab = new Array;

var worldsize = 200;
for(var i=0; i<worldsize; i++) {
	tab[i] = new Array;
	for(var j=0; j<worldsize; j++) {
		tab[i][j] = Math.round(Math.random()-.2);
	}
}
console.table(tab);

function init() {

}




function update(dt) {
	CamMovement(dt);
	if(sleep("fps", 10)) {
	tabC = new Array;
	for(var i=0; i<worldsize; i++) {
		tabC[i] = new Array;
		for(var j=0; j<worldsize; j++) {
			tabC[i][j] = CheckCell(tab,i,j);
		}
	}
	tab = tabC;
	}
}

function draw(dt) {
	var k=0;
	for(var i=0; i<tab.length;i++) {
		for(var j=0; j<tab[i].length;j++) {
			if(i>cam.x-1 && i<cam.x+cam.w &&
			j>cam.y-1 && j<cam.y+cam.h) {
			if(tab[i][j]==0) {
				//drawRect(i-cam.x,j-cam.y,grid_size,grid_size,"black");
			} else {
				drawFillRect(i-cam.x,j-cam.y,grid_size,grid_size,"black");
			}
			k++;
			}
		}
	}
	drawRect(0-cam.x, 0-cam.y, worldsize*grid_size, worldsize*grid_size, "black");
	//console.log(k);
			
}


function CheckCell(array, cellX,cellY) {
	var n = 0;

	if(cellX == 0) {
		if(cellY == 0) {
			if(array[cellX+1][cellY] == 1) {
				n++;
			}
			if(array[cellX+1][cellY+1] == 1) {
				n++;
			}
			if(array[cellX][cellY+1] == 1) {
				n++;
			}
		} else {
			if(array[cellX][cellY-1] == 1) {
				n++;
			}
			if(array[cellX+1][cellY-1] == 1) {
				n++;
			}
			if(array[cellX+1][cellY] == 1) {
				n++;
			}
			if(array[cellX+1][cellY+1] == 1) {
				n++;
			}
			if(array[cellX][cellY+1] == 1) {
				n++;
			}
		}
	} else if(cellX==worldsize-1){
		if(array[cellX][cellY-1] == 1) {
			n++;
		}
		if(array[cellX][cellY+1] == 1) {
			n++;
		}
		if(array[cellX-1][cellY+1] == 1) {
			n++;
		}
		if(array[cellX-1][cellY] == 1) {
			n++;
		}
		if(array[cellX-1][cellY-1] == 1) {
			n++;
		}
	}else {
		if(array[cellX][cellY-1] == 1) {
			n++;
		}
		if(array[cellX+1][cellY-1] == 1) {
			n++;
		}
		if(array[cellX+1][cellY] == 1) {
			n++;
		}
		if(array[cellX+1][cellY+1] == 1) {
			n++;
		}
		if(array[cellX][cellY+1] == 1) {
			n++;
		}
		if(array[cellX-1][cellY+1] == 1) {
			n++;
		}
		if(array[cellX-1][cellY] == 1) {
			n++;
		}
		if(array[cellX-1][cellY-1] == 1) {
			n++;
		}

	}

	if(array[cellX][cellY] == 1) {
		if(n==2 || n==3) {
			return 1;
		} else {
			return 0;
		}
	} else {
		if(n==3) {
			return 1;
		} else {
			return 0;
		}
	}
}

function CamMovement(dt) {
	if(keyPressed(38)) {
		cam.y-=cam.spd*dt;
	}
	if(keyPressed(39)) {
		cam.x+=cam.spd*dt;
	}
	if(keyPressed(40)) {
		cam.y+=cam.spd*dt;
	}
	if(keyPressed(37)) {
		cam.x-=cam.spd*dt;
	}

	if(keyButton(107)) {
		game.grid_size++;
		grid_size++;
	}
	if(keyButton(109) && game.grid_size >1) {
		game.grid_size--;
		grid_size--;
	}
}