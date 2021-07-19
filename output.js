window.types={
	point:function(x=0,y=0){//АТТЕНШОН мб
		this.x=x;
		this.y=y;
	},
	vector:function(x=0,y=0,ispx=true){
		this.x=x;
		this.y=y;
		this.ispx=ispx;
		this.cf=function(value){
			this.x=value.x;
			this.y=value.y;
			this.ispx=value.ispx;};
		this.eq=function(value){return this.x==value.x&&this.y==value.y;};
		this.px=function(){
			if(this.ispx)
				return this;
			return new types.vector(this.x*vars.sizes.cell.x,
									this.y*vars.sizes.cell.y);
		};
		this.pt=function(){
			if(this.ispx)
				return new types.vector(Math.floor(this.x/vars.sizes.cell.x),
										Math.floor(this.y/vars.sizes.cell.y),false);
			return this;
		};
		this.topx=function(){
			this.cf(this.px());
			this.ispx=true;

			return this;
		};
		this.topt=function(){
			this.cf(this.pt());
			this.ispx=false;

			return this;
		};
	},
	cell:function(pos,mine=false,opened=false,flag=false){
		this.pos=pos||new types.vector();
		this.mine=mine;
		this.opened=opened;
		this.flag=flag;
		//this.scanned=undefined;
		//this.nearMinesCount=undefined;
		this.qOpen=function(){
			this.opened=true;
			base.draw.standFuncs.drawCell(this);
		};
		this.open=function(){
			if(this.flag||this.opened){
				return false;
			}else{
				if(this.mine)
					base.gameover();
				this.qOpen();

				if(this.getMinesNum()===0){//if(this.nearMinesCount===0){
					let toscan=[this],cell;
					while(toscan.length>0){
						let newtoscan=[];
						for(let n=0;n<toscan.length;n++){
							for(let i=-1;i<=1;i++){
								for(let ii=-1;ii<=1;ii++){
									if(i||ii){
										toscan[n].pos.topt();
										cell=base.cell(toscan[n].pos.x+i,toscan[n].pos.y+ii);
										if(cell&&!cell.opened){
											cell.qOpen();
											if(cell.getMinesNum()===0)
												newtoscan.push(cell);
										}
									}
								}
							}
							//toscan[n].qOpen();
						}
						toscan=newtoscan;
					}
				}

				return true;
			}
		};
		this.mark=function(){
			if(this.opened)
				return false;
			else{
				this.flag=!this.flag;
				if(this.flag)
					base.flagsCount++;
				else
					base.flagsCount--;
				base.draw.standFuncs.drawCell(this);

				return true;
			}
		};
		this.getMinesNum=function(){
			let minesNum=0,cell;

			this.pos.topt();
			for(let i=-1;i<=1;i++){
				for(let ii=-1;ii<=1;ii++){
					if(i||ii){
						cell=base.cell(this.pos.x+i,this.pos.y+ii);
						if(cell&&cell.mine)
							minesNum++;
					}
				}
			}
			this.nearMinesCount=minesNum;
			return minesNum;
		};
		this.getFlagsNum=function(){
			let flagsNum=0,cell;

			this.pos.topt();
			for(let i=-1;i<=1;i++){
				for(let ii=-1;ii<=1;ii++){
					if(i||ii){
						cell=base.cell(this.pos.x+i,this.pos.y+ii);
						if(cell&&cell.flag)
							flagsNum++;
					}
				}
			}
			//this.nearFlagsCount=flagsNum;
			return flagsNum;
		};
		this.openWithNear=function(){
			let cell;
			this.pos.topt();
			for(let i=-1;i<=1;i++){
				for(let ii=-1;ii<=1;ii++){
					cell=base.cell(this.pos.x+i,this.pos.y+ii);
					if(cell)
						cell.open();
				}
			}
		}
	}
};

window.vars={
	sizes:{
		cell:new types.vector(25,25),
		field:new types.vector(60,30),
		get canvas(){return new types.vector(this.field.x*this.cell.x,
											 this.field.y*this.cell.y);}
	},
	cnvId:'canvas',
	drawIterval:15,
	lineWidth:1
};

Math.randint=function(a){return Math.round(Math.random()*a);};window.mousebase={
	mo:{
		pos:new types.vector(),
		lapos:new types.vector(),
		vel:new types.vector(),
		scrolldir:0,
		enableContextMenu:false
	},
	runlists:{
		clc:[],
		rclc:[],
		scroll:[],
		move:[]
	},
	shiftobj:document.body,
	addListener(listentype,listener){
		if(listentype=='lclick'){
			mousebase.runlists.clc.push(listener);
		}else if(listentype=='rclick'){
			mousebase.runlists.rclc.push(listener)
		}else if(listentype=='scroll'){
			mousebase.runlists.scroll.push(listener);
		}else if(listentype=='move'){
			mousebase.runlists.move.push(listener);
		}
	}
};

window.onmousemove=function(event){
	let shift=mousebase.shiftobj.getBoundingClientRect();

	mousebase.mo.lapos.cf(mousebase.mo.pos);

	mousebase.mo.pos.x=event.clientX-shift.x;
	mousebase.mo.pos.y=event.clientY-shift.y;

	mousebase.mo.vel.x=mousebase.mo.pos.x-mousebase.mo.lapos.x;
	mousebase.mo.vel.y=mousebase.mo.pos.y-mousebase.mo.lapos.y;

	for(let i of mousebase.runlists.move)
		i();
};

window.onclick=function(){
	for(let i of mousebase.runlists.clc)
		i();
}

window.oncontextmenu=function(){
	for(let i of mousebase.runlists.rclc)
		i();

	return mousebase.mo.enableContextMenu;
}

window.onwheel=function(event){
	mousebase.mo.scrolldir=Math.sign(event.deltaY);
	for(let i of mousebase.runlists.scroll)
		i();
};
window.base={
	init(){
		mousebase.shiftobj=base.cnv.el;

		base.cnv.el.setAttribute('width',vars.sizes.canvas.x);
		base.cnv.el.setAttribute('height',vars.sizes.canvas.y);

		base.cellsList=new Array(vars.sizes.field.x);
		for(let i=0;i<base.cellsList.length;i++){
			base.cellsList[i]=new Array(vars.sizes.field.y);
			for(let ii=0;ii<base.cellsList[i].length;ii++){
				//base.cellsList[i][ii]=new types.cell(new types.vector(i,ii,false),Math.randint(4)==0);//АТТЕНШОН
				base.cellsList[i][ii]=new types.cell(new types.vector(i,ii,false));//АТТЕНШОН
				base.draw.standFuncs.drawCell(base.cellsList[i][ii]);
			}
		}
		base.flagsCount=0;
		base.randomizeMines();
	},

	cnv:{
		get el(){return document.getElementById(vars.cnvId)},
		get ctx(){return this.el.getContext('2d')},
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
					p1.topx();//мб
					p2.topx();//аттеншон
					//как показала практика, то, что находится выше, не просто аттеншон, а самое настоящее АТТЕНШОН ТВОЮ МАТЬ, ЭТО САМОЕ КРИВОЖОПОЕ ЧТО БЫЛО В ЭТОМ ПРОЕКТЕ(возможно)
					cnv.beginPath();
					cnv.moveTo(p1.x,p1.y);
					cnv.lineTo(p2.x,p2.y);
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
				cell.pos.topx();
				let cnv=base.cnv.ctx,
					t=new types.vector(vars.sizes.cell.x/4,vars.sizes.cell.y/4);
				function drawX(){
					cnv.beginPath();
					cnv.moveTo(cell.pos.x+t.x  ,cell.pos.y+t.y  );
					cnv.lineTo(cell.pos.x+t.x*3,cell.pos.y+t.y*3);
					cnv.moveTo(cell.pos.x+t.x*3,cell.pos.y+t.y  );
					cnv.lineTo(cell.pos.x+t.x  ,cell.pos.y+t.y*3);
					cnv.closePath();
					cnv.stroke();
				};
				function drawMine(){
					drawX(cell,cnv);
					cnv.beginPath();
					cnv.moveTo(cell.pos.x+t.x  ,cell.pos.y+t.y*2);
					cnv.lineTo(cell.pos.x+t.x*3,cell.pos.y+t.y*2);
					cnv.moveTo(cell.pos.x+t.x*2,cell.pos.y+t.y  );
					cnv.lineTo(cell.pos.x+t.x*2,cell.pos.y+t.y*3);
					cnv.closePath();
					cnv.stroke();
				};
				function drawFlag(){
					cnv.beginPath();
					cnv.moveTo(cell.pos.x+t.x*2,cell.pos.y+t.y*3);
					cnv.lineTo(cell.pos.x+t.x*2,cell.pos.y+t.y  );
					cnv.lineTo(cell.pos.x+t.x  ,cell.pos.y+t.y  );
					cnv.lineTo(cell.pos.x+t.x  ,cell.pos.y+t.y*2);
					cnv.lineTo(cell.pos.x+t.x*2,cell.pos.y+t.y*2);
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
						[],
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
					cell.pos.topx();
					for(let i=0;i<ntp[num].length-1;i++){
						ttt=[points[ntp[num][i  ]],
							 points[ntp[num][i+1]]];

						cnv.moveTo(cell.pos.x+ttt[0].x,cell.pos.y+ttt[0].y);
						cnv.lineTo(cell.pos.x+ttt[1].x,cell.pos.y+ttt[1].y);
					}
					cnv.closePath();
					cnv.stroke();
				};
				function drawBox(color='#D3D3D3'){
					let hlw=vars.lineWidth/2;

					cnv.fillStyle=color;
					cnv.fillRect(cell.pos.x+hlw,
								 cell.pos.y+hlw,
								 vars.sizes.cell.x-hlw,
								 vars.sizes.cell.y-hlw);
				};

				if(cell.opened){
					if(cell.mine){
						if(cell.flag)
							drawBox("#00FF00");
						else
							drawBox("#FF0000");
						drawMine();
					}else{
						drawBox('#FFFFFF');
						drawNum(cell.getMinesNum());
					}
				}else{
					drawBox('#D3D3D3');
					if(cell.flag)
						drawFlag();
				}
			},
			clearCell(cell){
				cell.pos.topx();
				base.cnv.ctx.clearRect(cell.pos.x,
									   cell.pos.y,
									   vars.sizes.cell.x,
									   vars.sizes.cell.y);
			}
		}
	},

	cellsList:[],
	flagsCount:undefined,
	minesCount:undefined,
	cell(x,y){
		function inr(x,a,b){return x>=a&&x<=b;}
		if(inr(x,0,vars.sizes.field.x-1)&&inr(y,0,vars.sizes.field.y-1))
			return this.cellsList[x][y];
		else
			return false;
	},
	randomizeMines(ccell,prob=0.3,startRange=2,startRangeEnd=startRange+3){
		function f(x,a,b=a+1){
			if(x<a)
				return 0;
			else if(x>=a&&x<=b)
				return x-a;
			else if(x>b)
				return b-a;
		}

		ccell=ccell||base.cell(0,0);
		for(let i of base.cellsList){
			for(let ii of i){
				ii.pos.topt();
				let distFactor=f(ii.pos.x+ii.pos.y,startRange,startRangeEnd);
				ii.mine=Math.random()<=prob*distFactor;
			}
		}
	},

	gameover(result){
		console.log('gameover');
		base.openAll();
	},
	openAll(){
		for(let i of base.cellsList){
			for(let ii of i){
				ii.qOpen();
			}
		}
	}
};window.main={
	start(){
		base.init();

		function click(){
			let tcp=mousebase.mo.pos.pt();
			let tc=base.cell(tcp.x,tcp.y);

			if(tc){
				if(tc.getFlagsNum()>=tc.getMinesNum()&&tc.opened)
					tc.openWithNear();
				else
					tc.open();
			}
		}

		mousebase.addListener('lclick',click);
		//mousebase.addListener('scroll',click);
		//mousebase.addListener('move',click);

		mousebase.addListener('rclick',function(){
			let tcp=mousebase.mo.pos.pt();
			let tc=base.cell(tcp.x,tcp.y);

			if(tc)
				tc.mark();
		});

		//base.openAll();
	}
};