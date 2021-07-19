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
		this.nearMinesCount=undefined;
		this.qOpen=function(){
			this.opened=true;
			base.draw.standFuncs.drawCell(this);
		};
		this.open=function(){
			if(this.flag||this.opened){
				return false;
			}else{
				if(this.mine)
					base.gameover(this);
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
											 this.field.y*this.cell.y);},
	},
	cnvId:'canvas',
	menuId:'menu',
	drawIterval:15,
	lineWidth:1
};

Math.randint=function(a){return Math.round(Math.random()*a);};