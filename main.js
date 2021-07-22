window.main={
	start(){
		let firstClick=true;
		base.init();

		function click(){
			let tcp=mousebase.mo.pos.pt;
			tcp.x=Math.floor(tcp.x);
			tcp.y=Math.floor(tcp.y);
			let tc=base.cell(tcp.x,tcp.y);
			if(firstClick){
				firstClick=false;
				base.randomizeMines(tc,0.2,3,5);
			}

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
			let tcp=mousebase.mo.pos.pt;
			tcp.x=Math.floor(tcp.x);
			tcp.y=Math.floor(tcp.y);
			let tc=base.cell(tcp.x,tcp.y);

			if(tc)
				tc.mark();
		});

		//base.openAll();
	}
};
