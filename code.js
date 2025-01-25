/* ***************************************
* fichier js du projet contamination     *
* 19 mars 2021                           *
******************************************/
/* donnees importantes*/
var 
	incidence = 0.1,
	hauteur =  0.80*screen.height,
	largeur =  0.97*screen.width ,
	lesGens = []   ,
	lesMalades = [],
	pasMalades = [],
	compteurAge = 0,
	vMax = 2,
	nbConta=0,
	nbimmu=0;
	pause = false;
let 
		mortPlus = 0.05,
		mortMoins = 0.00001;

/* constructeur d'objets */
function roberto(){
	this.age  = Math.round((Math.random()*120));
	this.immu = 0; // pas d'immunite initiale (c'est notre choix) //
	if (Math.random()>incidence){
		this.sain = true;
		this.alive = true
		this.symptomes = 0; 
		this.tMalade = 0;
	} else {
		this.sain = false;
		this.symptomes = 10+ Math.round((Math.random()*90));
		this.tMalade = Math.round(Math.random()*14);
	}
	this.pasMalin = Math.round((Math.random()*100));
	if (this.pasMalin > 80){
		this.antivax = true;
	} else {
		this.antivax = false;
	}
	this.posX = Math.round(Math.random()*largeur);
	this.posY = Math.round(Math.random()*hauteur);
	this.vX   = Math.round(Math.random()*2*vMax - vMax);
	this.vY   = Math.round(Math.random()*2*vMax - vMax);
	/** charte couleurs 
	    sain : green 
		**/
		tempRed =   50  + Math.round(this.symptomes*2);
		tempGreen = 250 - tempRed;
		tempBlue =  70;
	
	this.color = "rgb("+tempRed+","+tempGreen+","+tempBlue+")";			
}

function anotherDay() {
	for(k=0; k< lesMalades.length; k++){
		lesGens[lesMalades[k]].tMalade += 1;
	}
}

function killThemAll(){
	
	for (i=0;i<lesGens.length;i++){		
		if (lesGens[i].age > 100) {
				lesGens[i].alive = false;
				lesGens[i].vX = 0;
				lesGens[i].vY = 0;
				lesGens[i].color = "rgb(255,255,255)";
				if (i in lesMalades) {
					lesMalades.splice(lesMalades.indexOf(i),1);
				} else {pasMalades.splice(pasMalades.indexOf(i),1); }
		} else {
			lesGens[i].age +=1;
		}	
	}
}	

/* On initialise les graphiques */
function initGraph(){
	document.body.innerHTML += "<canvas id='le canvas' height='"+hauteur+"' width='"+largeur+"'></canvas>";
	grr = document.getElementById('le canvas');
	ctx = grr.getContext('2d');
}

function refresh(){
	if (pause===false){
	/* on efface */
	ctx.save();
	ctx.fillStyle="rgba(0,0,0,0.8)";
	ctx.fillRect(0,0,largeur,hauteur);
	ctx.restore();
	
	/* on guerit */
	for (i=0; i<lesMalades.length; i++){
		if ((lesGens[lesMalades[i]].tMalade > 14)&&(lesGens[lesMalades[i]].alive)) {
			lesGens[lesMalades[i]].sain = true;
			lesGens[lesMalades[i]].symptomes = 0;
			lesGens[lesMalades[i]].immu = 95 + Math.round(Math.random()*5);
			lesGens[lesMalades[i]].color = "rgb(0, 200, 200)"; // cyan
		}
	}
	
	/* on tue les malades */
	for (i=0;i<lesMalades.length;i++){
		if (lesGens[lesMalades[i]].age > 65) {
			//plus de 65
			if (lesGens[lesMalades[i]].symptomes > 50){
				if (Math.random() < mortPlus ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			} else {
				if (Math.random() < mortMoins ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			}
		} else {
			if (lesGens[lesMalades[i]].age > 30){
			//plus de 30 et moins de 65
			if (lesGens[lesMalades[i]].symptomes > 80){
				if (Math.random() < mortPlus ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			} else {
				if (Math.random() < mortMoins ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			}
		} else {
			//moins de 30
			if (lesGens[lesMalades[i]].symptomes > 95){
				if (Math.random() < mortPlus ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			} else {
				if (Math.random() < mortMoins ) {
					lesGens[i].alive = false;
					lesGens[i].vX = 0;
					lesGens[i].vY = 0;
					lesGens[i].color = "rgb(255,255,255)";
					lesMalades.splice(lesMalades.indexOf(i),1);				
				}
			}
		}
		}
	}
	
	
	/* on contamine */
	brigitte = []; // brigitte de la compta gere les contamines //
	for (i=0 ; i< lesMalades.length ; i++){
		for (j=0 ; j< pasMalades.length ; j++) {				
			if (Math.abs(lesGens[pasMalades[j]].posX - lesGens[lesMalades[i]].posX) <= 12) {
				if (Math.abs(lesGens[pasMalades[j]].posY - lesGens[lesMalades[i]].posY) <= 12) {
						if (Math.random()<lesGens[lesMalades[i]].symptomes){
							if (Math.random()>lesGens[pasMalades[j]].immu){
								lesGens[pasMalades[j]].sain = false;
								lesGens[pasMalades[j]].symptomes = 10+ Math.round((Math.random()*90));
								brigitte.push(pasMalades[j])
								tempRed =   150  + Math.round(lesGens[pasMalades[j]].symptomes);
								tempGreen = 250 - tempRed;
								tempBlue =  70;	
								lesGens[j].color = "rgb("+tempRed+","+tempGreen+","+tempBlue+")";
								nbConta+=1;	
								document.getElementById("nbConta").innerHTML = nbConta;
							}
						}
					}
				}
			}
		}
	for (k=0; k<brigitte.length; k++){
		lesMalades.push(brigitte[k]);
		pasMalades.splice(pasMalades.indexOf(brigitte[k]),1);
	}
	/* on deplace */
	for (i=0;i< lesGens.length; i++) {
		lesGens[i].posX += lesGens[i].vX;
		if (lesGens[i].posX > largeur){lesGens[i].posX=0;}
		else if (lesGens[i].posX < 0 ){lesGens[i].posX=largeur;}
		lesGens[i].posY += lesGens[i].vY;
		if (lesGens[i].posY > hauteur){lesGens[i].posY=0;}
		else if (lesGens[i].posY < 0 ){lesGens[i].posY=hauteur;}
	}
	
	/* on place les gens */
	for (i=0;i< lesGens.length; i++) {
		ctx.beginPath();
		ctx.save();
		ctx.fillStyle= lesGens[i].color ;
		ctx.arc(lesGens[i].posX,lesGens[i].posY,6,0,2*Math.PI);
		ctx.fill();
		ctx.restore();
	}
	}
	
}

/* fonction principale ***************************** */
function changePop(){
	population = Number(document.getElementById("pop").value);
}


function go() {
	ctx.fillStyle="rgba(0,0,0,0.8)";
	ctx.fillRect(0,0,largeur,hauteur);
	lesGens = [];
	lesMalades = [];
	pasMalades = [];
	compteurAge = 0;
	for (i=0;i<population;i++){
		lesGens.push(new roberto())
	}
	for (i=0;i<population;i++){
		if (lesGens[i].sain) {
			pasMalades.push(i);
		} else {
			lesMalades.push(i);			
		}
	}
	document.getElementById("nbMalades").innerHTML = lesMalades.length;
	document.getElementById("nbConta").innerHTML = 0;
	nbConta=0
	tempo1 = setInterval(refresh,10);
	tempo2 = setInterval(killThemAll,300000)
	tempo3 = setInterval(anotherDay, 1000)
}

function openPopup() {
	const popup = document.getElementById("popup");
	const popupBody = document.getElementById("popup-body");
	popup.style.display = "flex";
  }
function closePopup() {
	const popup = document.getElementById("popup");
	popup.style.display = "none";
  }