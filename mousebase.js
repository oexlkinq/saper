window.mousebase={
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
}