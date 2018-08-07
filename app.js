window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

var byte = function() {
	var analyser = context.createAnalyser();
	analyser.fftSize = 256;

	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(analyser.fftSize);

	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then(function(stream) {
			// Create a MediaStreamAudioSourceNode
			// Feed the HTMLMediaElement into it
			var source = context.createMediaStreamSource(stream);
			source.connect(analyser);
			source.connect(context.destination);

			d3
				.select('div.graph-two')
				.selectAll('div')
				.data(dataArray)
				.enter()
				.append('div')
				.attr('class', 'bar-two');
			log();
		})
		.catch(function(err) {
			console.log('The following gUM error occured: ' + err);
		});

	function log() {
		requestAnimationFrame(log);
		analyser.getByteTimeDomainData(dataArray);
		// console.log(dataArray);
		// console.log(bufferLength);
		var bar = document.getElementById('bar');
		barHeight = dataArray[dataArray.length - 1];
		var t = d3.transition().duration(300);
		d3
			.selectAll('div.bar-two')
			.data(dataArray) // .transition()
			.style('height', function(d) {
				var barHeight = 300 - d;
				return barHeight + 'px';
			});
		// 	.style('background-color', 'rgb(' + Math.round(barHeight) + ',244,244)');
		document.getElementById('byte').innerHTML = Math.round(barHeight);
	}
};

var freq = function() {
	var analyser = context.createAnalyser();
	analyser.fftSize = 256;

	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Float32Array(bufferLength);

	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then(function(stream) {
			// Create a MediaStreamAudioSourceNode
			// Feed the HTMLMediaElement into it
			var source = context.createMediaStreamSource(stream);
			source.connect(analyser);
			source.connect(context.destination);

			d3
				.select('div.graph')
				.selectAll('div')
				.data(dataArray)
				.enter()
				.append('div')
				.attr('class', 'bar');
			log();
		})
		.catch(function(err) {
			console.log('The following gUM error occured: ' + err);
		});

	function log() {
		requestAnimationFrame(log);
		analyser.getFloatFrequencyData(dataArray);
		console.log(dataArray[dataArray.length - 1]);
		// console.log(bufferLength);
		var bar = document.getElementById('bar');
		barHeight = dataArray[dataArray.length - 1];
		d3
			.selectAll('div.bar')
			.data(dataArray)
			// .transition()
			.style('height', function(d) {
				var barHeight = 300 - d * -1;
				return barHeight + 'px';
			})
			.style(
				'background-color',
				'rgb(' + Math.round(barHeight * -1) + ',244,179)'
			);
		document.getElementById('frequency').innerHTML =
			Math.round(barHeight) + ' (rounded)';
	}
};

freq();
// byte();
