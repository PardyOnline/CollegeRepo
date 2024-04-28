// Load the CSV file for 2007 Wide Receivers and process data
d3.csv("2007 WR.csv").then(function(data) {
    // Data preprocessing: Convert string percentages and numerical values
    data.forEach(function(d) {
        d.Tgt = +d.Tgt;
        d.Rec = +d.Rec;
        d.Yds = +d.Yds;
        d.TD = +d.TD;
        d.Fmb = +d.Fmb;
        d['Ctch%'] = parseFloat(d['Ctch%'].replace('%', '')) / 100;
        d['Succ%'] = parseFloat(d['Succ%'].replace('%', '')) / 100;
        d['Y/R'] = +d['Y/R'];
        d['Y/Tgt'] = +d['Y/Tgt'];
    });

    // Visualization setup: dimensions and margin
    var dimensions = ["Tgt", "Rec", "Yds", "TD", "Fmb", "Ctch%", "Succ%", "Y/R", "Y/Tgt"];
    var margin = { top: 30, right: 10, bottom: 30, left: 100 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Append SVG to the body of the page
    var svg = d3.select("#parallel-coordinates1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scale and axes for each dimension
    var y = {};
    var x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);

    dimensions.forEach(function(d) {
        y[d] = d3.scaleLinear()
            .domain(d3.extent(data, function(p) { return +p[d]; }))
            .range([height, 0]);
        var axis = d.includes("%") ? d3.axisLeft(y[d]).tickFormat(d3.format(".0%")) : d3.axisLeft(y[d]);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + x(d) + ")")
            .call(axis)
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(d)
            .style("fill", "black");
    });

    // Draw lines with interactivity
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    var lines = svg.selectAll(".line")
        .data(data)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d) { return color(d["Player"]); })
        .style("opacity", 0.5)
        .on("mouseover", function(event, d) {
            d3.selectAll(".line").style("opacity", 0.1);
            d3.select(this).style("opacity", 1).style("stroke-width", "4px");
        })
        .on("mouseout", function() {
            d3.selectAll(".line").style("opacity", 0.5);
            d3.select(this).style("stroke-width", "2px");
        });

    // Background color and axis styles
    svg.selectAll(".axis .tick line, .axis .domain")
        .style("stroke", "black");
    svg.selectAll(".axis text")
        .style("font-size", "13px").style("font-family", "sans-serif").style("stroke", "black");

    // Create the legend in its dedicated SVG
    var legendSvg = d3.select("#legend-wrs").append("svg")
    .attr("width", 200)
    .attr("height", height)
    .append("g");

    var legend = legendSvg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; })
        .style("font-size", "12px");

    // Adding tooltip functionality
    var tooltip = d3.select("#tooltip1");

    svg.selectAll(".line")
    .on("mouseover", function(event, d) {
        d3.selectAll(".line").style("opacity", 0.1); // Dim other lines
        d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "4px");

        // Update the tooltip content and position it according to the mouse position
        tooltip.html(
            "<strong>Player:</strong> " + d["Player"] + "<br>" +
            "<strong>TD:</strong> " + d["TD"] + "<br>" +
            "<strong>Fmb:</strong> " + d["Fmb"] + "<br>" +
            "<strong>Yds:</strong> " + d["Yds"]
        )
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("opacity", 1);
    })
    .on("mouseout", function() {
        d3.selectAll(".line").style("opacity", 0.5);
        d3.select(this).style("stroke-width", "2px");
        tooltip.style("opacity", 0);
    });

});


