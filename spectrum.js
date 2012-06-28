JSSpeccy.Spectrum = function(opts) {
	var self = {};

	var model = opts.model || JSSpeccy.Spectrum.MODEL_128K;

	var ui = opts.ui;
	var keyboard = opts.keyboard;

	var memory = JSSpeccy.Memory({
		model: (model === JSSpeccy.Spectrum.MODEL_48K ? JSSpeccy.Memory.MODEL_48K : JSSpeccy.Memory.MODEL_128K)
	});

	var display = JSSpeccy.Display({
		ui: ui,
		memory: memory,
		model: (model === JSSpeccy.Spectrum.MODEL_48K ? JSSpeccy.Display.MODEL_48K : JSSpeccy.Display.MODEL_128K)
	});

	var ioBus = JSSpeccy.IOBus({
		keyboard: keyboard,
		display: display,
		memory: memory
	});

	var processor = JSSpeccy.Z80({
		memory: memory,
		ioBus: ioBus,
		display: display
	});

	self.runFrame = function() {
		processor.runFrame();
	};
	self.reset = function() {
		processor.reset();
		memory.reset();
	};

	self.loadSnapshot = function(snapshot) {
		memory.loadFromSnapshot(snapshot.memoryPages);
		processor.loadFromSnapshot(snapshot.registers);
		display.setBorder(snapshot.ulaState.borderColour);
	};

	JSSpeccy.traps.tapeLoad = function() {
		var addr = processor.getIX();
		var len = processor.getDE();
		console.log('LOAD ' + addr + ',' + len);
		processor.setCarry(false); /* indicate error */
		processor.setPC(0x05e2); /* address at which to exit tape trap */
	};

	return self;
};
JSSpeccy.Spectrum.MODEL_48K = 1;
JSSpeccy.Spectrum.MODEL_128K = 2;

