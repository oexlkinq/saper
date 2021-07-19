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

	mousebase.mo.pos.px.x=event.clientX-shift.x;
	mousebase.mo.pos.px.y=event.clientY-shift.y;

	mousebase.mo.vel.px.x=mousebase.mo.pos.px.x-mousebase.mo.lapos.px.x;
	mousebase.mo.vel.px.y=mousebase.mo.pos.px.y-mousebase.mo.lapos.px.y;

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
