window.base={
	init(fullf=true){
		mousebase.init(base.cnv.el);
		if(fullf){
			vars.sizes.field.x=Math.floor(document.documentElement.clientWidth/vars.sizes.cell.x);
			vars.sizes.field.y=Math.floor(document.documentElement.clientHeight/vars.sizes.cell.y)-1;
		}

		base.cnv.el.setAttribute('width',vars.sizes.canvas.x);
		base.cnv.el.setAttribute('height',vars.sizes.canvas.y);

		base.cellsList=new Array(vars.sizes.field.x);
		for(let i=0;i<base.cellsList.length;i++){
			base.cellsList[i]=new Array(vars.sizes.field.y);
			for(let ii=0;ii<base.cellsList[i].length;ii++){
				base.cellsList[i][ii]=new types.cell(new types.vector(i,ii,false));
				base.draw.standFuncs.drawCell(base.cellsList[i][ii]);
			}
		}
		base.flagsCount=0;
		//base.randomizeMines();
	},

	cnv:{
		_el:undefined,
		_ctx:undefined,
		get el(){if(this._el)return this._el;else return document.getElementById(vars.cnvId);},
		get ctx(){if(this._ctx)return this._ctx;else return this.el.getContext('2d');},
	},

	menu:{
		_el:undefined,
		get el(){if(this._el)return this._el;else return document.getElementById(vars.menuId);},
		set text(value){this.el.innerText=value;},
		get text(){return this.el.innerText;},
	},

	draw:{
		list:[],
		add(value){return this.list.push(value);},
		remove(value){this.list.splice(value,1);},
		run(){
			for(let i of this.list)
				i();
		},
		init(){
			return setInterval(this.run,vars.drawInterval);
		},
		stop(){clearInterval(this.timer);},
		timer:Math.round(Math.random()),//АТТЕНШОН!!!!
		standFuncs:{
			drawGrid(lineWidth=vars.lineWidth,lineColor='black'){
				function drawLine(p1,p2,cnv){
					// p1.topx();//мб
					// p2.topx();//аттеншон
					//как показала практика, то, что находится выше, не просто аттеншон, а самое настоящее АТТЕНШОН ТВОЮ МАТЬ, ЭТО САМОЕ КРИВОЖОПОЕ ЧТО БЫЛО В ЭТОМ ПРОЕКТЕ(возможно)
					cnv.beginPath();
					cnv.moveTo(p1.px.x,p1.px.y);
					cnv.lineTo(p2.px.x,p2.px.y);
					cnv.closePath();
					cnv.stroke();
				};

				let cnv=base.cnv.ctx;
				cnv.lineWidth=lineWidth;
				cnv.strokeStyle=lineColor;

				for(let i=0;i<=vars.sizes.field.x;i++){
					drawLine(new types.vector(i,0,false),
							 new types.vector(i,vars.sizes.field.y,false),cnv);
				}
				for(let i=0;i<=vars.sizes.field.y;i++){
					drawLine(new types.vector(0,i,false),
							 new types.vector(vars.sizes.field.x,i,false),cnv);
				}
			},
			drawCell(cell){
				this.clearCell(cell);//АТТЕНШОН мб
				// cell.pos.topx();
				let cnv=base.cnv.ctx,
					t=new types.vector(vars.sizes.cell.x/4,vars.sizes.cell.y/4);
				function drawX(){
					cnv.beginPath();
					cnv.moveTo(cell.pos.px.x+t.x  ,cell.pos.px.y+t.y  );
					cnv.lineTo(cell.pos.px.x+t.x*3,cell.pos.px.y+t.y*3);
					cnv.moveTo(cell.pos.px.x+t.x*3,cell.pos.px.y+t.y  );
					cnv.lineTo(cell.pos.px.x+t.x  ,cell.pos.px.y+t.y*3);
					cnv.closePath();
					cnv.stroke();
				};
				function drawMine(){
					drawX(cell,cnv);
					cnv.beginPath();
					cnv.moveTo(cell.pos.px.x+t.x  ,cell.pos.px.y+t.y*2);
					cnv.lineTo(cell.pos.px.x+t.x*3,cell.pos.px.y+t.y*2);
					cnv.moveTo(cell.pos.px.x+t.x*2,cell.pos.px.y+t.y  );
					cnv.lineTo(cell.pos.px.x+t.x*2,cell.pos.px.y+t.y*3);
					cnv.closePath();
					cnv.stroke();
				};
				function drawFlag(){
					cnv.beginPath();
					cnv.moveTo(cell.pos.px.x+t.x*2,cell.pos.px.y+t.y*3);
					cnv.lineTo(cell.pos.px.x+t.x*2,cell.pos.px.y+t.y  );
					cnv.lineTo(cell.pos.px.x+t.x  ,cell.pos.px.y+t.y  );
					cnv.lineTo(cell.pos.px.x+t.x  ,cell.pos.px.y+t.y*2);
					cnv.lineTo(cell.pos.px.x+t.x*2,cell.pos.px.y+t.y*2);
					cnv.closePath();
					cnv.stroke();
				};
				function drawNum(num,color='#000000'){
					let tt=new types.vector(vars.sizes.cell.x/3,vars.sizes.cell.y/4);
					let points=[
						new types.point(tt.x  ,tt.y  ),//АТТЕНШОН мб
						new types.point(tt.x*2,tt.y  ),//АТТЕНШОН мб
						new types.point(tt.x  ,tt.y*2),//АТТЕНШОН мб
						new types.point(tt.x*2,tt.y*2),//АТТЕНШОН мб
						new types.point(tt.x  ,tt.y*3),//АТТЕНШОН мб
						new types.point(tt.x*2,tt.y*3),//АТТЕНШОН мб
					];
					let ntp=[//АТТЕНШОН в некоторых цифрах, таких как 3, некоторые линии повторяются несколько раз
						[/*0,1,5,4,0*/],
						[1,5],
						[0,1,3,2,4,5],
						[0,1,3,2,3,5,4],
						[0,2,3,1,5],
						[1,0,2,3,5,4],
						[1,0,4,5,3,2],
						[0,1,5],
						[0,4,5,1,0,2,3],
						[3,2,0,1,5,4]
					];

					cnv.strokeStyle=color;
					cnv.beginPath();
					let ttt;
					// cell.pos.topx();
					for(let i=0;i<ntp[num].length-1;i++){
						ttt=[points[ntp[num][i]],
							 points[ntp[num][i+1]]];

						cnv.moveTo(cell.pos.px.x+ttt[0].x,cell.pos.px.y+ttt[0].y);
						cnv.lineTo(cell.pos.px.x+ttt[1].x,cell.pos.px.y+ttt[1].y);
					}
					cnv.closePath();
					cnv.stroke();
				};
				function drawBox(color='#D3D3D3'){
					let hlw=vars.lineWidth/2;

					cnv.fillStyle=color;
					cnv.fillRect(
						cell.pos.px.x+hlw,
						cell.pos.px.y+hlw,
						vars.sizes.cell.x-hlw,
						vars.sizes.cell.y-hlw
					);
				};

				if(cell.opened){
					if(cell.mine){
						if(cell.flag)
							drawBox("#00FF00");
						else
							drawBox("#FF0000");
						drawMine();
					}else{
						if(cell.flag)
							drawBox('#FFFF00');
						else
							drawBox('#FFFFFF');
						drawNum(cell.nearMinesCount||cell.getMinesNum());
					}
				}else{
					drawBox('#D3D3D3');
					if(cell.flag)
						drawFlag();
				}
			},
			clearCell(cell){
				// cell.pos.topx();
				base.cnv.ctx.clearRect(
					cell.pos.px.x,
					cell.pos.px.y,
					vars.sizes.cell.x,
					vars.sizes.cell.y
				);
			}
		}
	},

	cellsList:[],
	menuCellsList:[],
	flagsCount:undefined,
	minesCount:undefined,
	cell(x,y){
		function inr(x,a,b){return x>=a&&x<=b;}
		if(inr(x,0,vars.sizes.field.x-1)&&inr(y,0,vars.sizes.field.y-1))
			return this.cellsList[x][y];
		else
			return false;
	},
	randomizeMines(ccell,prob=0.2,startRange=2,startRangeEnd=startRange+3){
		function f(x,a,b=a+1){
			if(x<a)
				return 0;
			else if(x>=a&&x<=b)
				return (x-a)/(b-a);
			else if(x>b)
				return 1;
		}
		function distance(a,b){
			// a.pos.topt();
			// b.pos.topt();
			return Math.sqrt((b.pos.pt.x-a.pos.pt.x)**2+(b.pos.pt.y-a.pos.pt.y)**2);
		}

		base.minesCount=0;
		base.flagsCount=0;

		ccell=ccell||base.cell(10,10);
		let distFactor;
		for(let i of base.cellsList){
			for(let ii of i){
				// ii.pos.topt();
				// ccell.pos.topt();
				distFactor=f(distance(ccell,ii),startRange,startRangeEnd);
				ii.mine=Math.random()<=prob*distFactor;
				base.minesCount+=ii.mine;
			}
		}
	},

	gameover(result){
		if(result)
			console.log('gameover by ',result.pos.pt);
		base.openAll();
	},
	win(){
		base.gameover();
	},
	openAll(){
		for(let i of base.cellsList){
			for(let ii of i){
				ii.qOpen();
			}
		}
	},
	updateMenu(mines=base.minesCount,flags=base.flagsCount,additionText=''){
		//base.menu.text=`*: ${mines} | F: ${flags} | *-F: ${mines-flags}`;
		if(mines-flags==0){
			if(!additionText)
				additionText=' | \\0/';
			base.win();
		}
		base.menu.text=`*: ${mines-flags}${additionText}`;
	},
};
