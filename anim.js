let animationRunning = false;
const width = 600;
const height = 600;
const svg = d3.select("svg").attr("width", width).attr("height", height);

function drawSmile(){
	let smile = svg.append("g")
	.style("stroke", "green")
	.style("stroke-width", 2)
	.style("fill", "green");
	//лицо
	smile.append("circle")
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", 50)
	.style("fill", "red");
	//левый глаз
	smile.append("circle")
	.attr("cx", -20)
	.attr("cy", -10)
	.attr("r", 5);
	//правый глаз
	smile.append("circle")
	.attr("cx", 20)
	.attr("cy", -10)
	.attr("r", 5);
	smile.append("circle")
	.attr("cx", 0)
	.attr("cy", 10)
	.attr("r", 5);
	smile.append("circle")
	.attr("cx", 0)
	.attr("cy", -20)
	.attr("r", 5);
	// улыбка
	let arc = d3.arc()
	.innerRadius(35)
	.outerRadius(30);
   
	smile.append("path")
	.attr("d", arc({startAngle: Math.PI /3 * 2,
	endAngle: Math.PI/3 * 4}))
	.style("stroke", "brown")
	smile.attr("transform", `translate(150,550)`);
	return smile;
	
   }
   

function drawPath() {
	const controlPoints = [
		{ x: 150, y: 550 },
		{ x: 500, y: 300 },
		{ x: 150, y: 100 },
		
		];

	const data = [];
	const steps = 50;

	for (let i = 0; i < controlPoints.length - 1; i++) {
		const p1 = controlPoints[i];
		const p2 = controlPoints[i + 1];

		for (let step = 0; step <= steps; step++) {
			const t = step / steps;
			const x = p1.x + (p2.x - p1.x) * t;
			const y = p1.y + (p2.y - p1.y) * t;
			data.push({ x, y });
		}
	}

	const lineGenerator = d3.line()
	.x(d => d.x)
	.y(d => d.y);

	return svg.append("path")
	.attr("d", lineGenerator(data))
	.attr("stroke", "none")
	.attr("fill", "none");
}

function translateAlong(path) {
	const length = path.getTotalLength();
	return function() {
		return function(t) {
			const {x, y} = path.getPointAtLength(t * length);
			return `translate(${x},${y})`;
		}
	}
}

let pict = drawSmile();
pict.attr("transform", `translate(150, 550)`)

function animate() {
	if (!animationRunning) {
		animationRunning = true;
		const path = drawPath();
		const durationInput = d3.select("#duration").node();
		const duration = durationInput.value * 1000;
		const decScaleInput = d3.select("#decScale").node();
		const decScale = 1 + decScaleInput.value / 100;
		const rotateCheckbox = d3.select("#rotateCheckbox").node();

		pict.transition()
		.duration(duration)
		.ease(d3.easeLinear)
		.attrTween("transform", () => {
			return t => {
				const translate = translateAlong(path.node())()(t);
				return `${translate}`;
			};
		})
		.on("end", () => {
			animationRunning = false;
		});

		pict.selectAll("circle, path")
		.transition()
		.duration(duration)
		.ease(d3.easeLinear)
		.attrTween("transform", () => { 
			return t => `scale(${decScale * t + (1 - t)})`; 
		});
	}
}

function stop() {
	svg.selectAll("*").remove();
}

d3.select("#start").on("click", animate);
d3.select("#clear").on("click", stop);

