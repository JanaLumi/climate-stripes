// Original stripes visualization by Ed Hawkins: https://twitter.com/ed_hawkins

function readData(file, id) {
	console.log("read the data");
	d3.csv(file, processData)
        .then((data) => graph(data, id))
        .catch((error) => console.log("Error: ", error.message));
}
function processData(datum) {
	let dataItem = {
		year: parseFloat(datum.Year) ||  0.00,
		avg: parseFloat(datum["J-D"]) || 0.00
	};
	return dataItem;
}

function graph(data, id) {
	console.log(id, data);
	let colours = ["#08306b" , "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#f7fbff", "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];
	let stripeWidth = 4;
	let stripeHeight = 300;
	let avgData = data.map((d) => d.avg);
	let linearScaleForData =
		d3.scaleLinear()
			.domain([d3.min(avgData), d3.max(avgData)])
			.range([0, colours.length-1]);
			
	let svg = d3.select(id).append("svg")
					 .attr("width", data.length * stripeWidth)
					 .attr("height", stripeHeight);
					 
	let tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
            return `<strong>Year:</strong> ${d.year}<br><strong>Avg:</strong> ${d.avg}`;
        });
	
	svg.call(tip);
	
	let stripes = svg.selectAll("rect")
							.data(data).enter()
							.append("rect")
							.attr("width", stripeWidth)
							.attr("height", stripeHeight)
							.attr("x", (d, i) => i * stripeWidth)
							.attr("y", 0)
							.style("fill", (d, i) => colours[Math.round(linearScaleForData(d.avg))])
							.on('mouseover', tip.show) // Show tooltip on mouseover
							.on('mouseout', tip.hide); // Hide tooltip on mouseout
}
