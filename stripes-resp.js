// Original stripes visualization by Ed Hawkins: https://twitter.com/ed_hawkins

function readData(file, id) {
    console.log("read the data");
    d3.csv(file, processData)
        .then((data) => graph(data, id))
        .catch((error) => console.log("Error: ", error.message));
}

function processData(datum) {
    let dataItem = {
        year: parseFloat(datum.Year) || 0.00,
        avg: parseFloat(datum["J-D"]) || 0.00
    };
    return dataItem;
}

function graph(data, id) {
    console.log(id, data);
    let colours = [
        "#08306b",
        "#08519c",
        "#2171b5",
        "#4292c6",
        "#6baed6",
        "#9ecae1",
        "#c6dbef",
        "#deebf7",
        "#f7fbff",
        "#fff5eb",
        "#fee6ce",
        "#fdd0a2",
        "#fdae6b",
        "#fd8d3c",
        "#f16913",
        "#d94801",
        "#a63603",
        "#7f2704"
    ];
    // let stripeWidth = 4;
    let stripeHeight = 300;

	let avgData = data.map((d) => d.avg);
	let linearScaleForData =
		d3.scaleLinear()
			.domain([d3.min(avgData), d3.max(avgData)])
			.range([0, colours.length-1]);

    // Function to update SVG dimensions based on container size
    function updateDimensions() {
        let container = document.querySelector(id);
        let containerWidth = container.clientWidth;

        // Calculate stripeWidth based on the container width and number of data points
        let numStripes = data.length;
        let stripeWidth = containerWidth / numStripes;

        let svg = d3.select(id + " svg");

        // Update SVG width based on container width
        svg.attr("width", containerWidth)
			.attr("x", 0); // Align to the left by setting x to 0

        // Update the width of the rectangles based on the calculated stripeWidth
        let stripes = svg.selectAll("rect")
            .attr("width", stripeWidth)
            .attr("x", (d, i) => i * stripeWidth);
    }

    // Initial setup
    let svg = d3
        .select(id)
        .append("svg")
        .attr("width", "100%") // Set initial width to 100% of the container
        .attr("height", stripeHeight)
		.attr("x", 0); // Align to the left by setting x to 0

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function (d) {
            return `<strong>Year:</strong> ${d.year}<br><strong>Avg:</strong> ${d.avg}`;
        });

    svg.call(tip);

    let stripes = svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", stripeHeight)
        .attr("y", 0)
        .style("fill", (d, i) => colours[Math.round(linearScaleForData(d.avg))])
        .on("mouseover", tip.show) // Show tooltip on mouseover
        .on("mouseout", tip.hide); // Hide tooltip on mouseout

    // Listen for window resize events and update dimensions accordingly
    window.addEventListener("resize", updateDimensions);
    // Call updateDimensions initially to set the correct dimensions on page load
    updateDimensions();
}
