d3.csv("Tom Brady vs Average QB 2007.csv").then(function(data) {
   // Data preprocessing: Convert string percentages and other numbers
    data.forEach(function(d) {
        d["Cmp/GP"] = +d["Cmp/GP"];
        d["Att/GP"] = +d["Att/GP"];
        d["Cmp%"] = parseFloat(d["Cmp%"]) / 100; // Remove replace('%', '')
        d["TD/GP"] = +d["TD/GP"];
        d["TD%"] = parseFloat(d["TD%"]) / 100; // Remove replace('%', '')
        d["Int/GP"] = +d["Int/GP"];
        d["Int%"] = parseFloat(d["Int%"]) / 100; // Remove replace('%', '')
        d["Y/G"] = +d["Y/G"];
        d["Pass Rating"] = +d["Pass Rating"];
    });

    // Visualization dimensions and margins
    var dimensions = ["Cmp/GP", "Att/GP", "Cmp%", "TD/GP", "TD%", "Int/GP", "Int%", "Y/G", "Pass Rating"];
    var width = 960;
    var height = 500;
    var margin = { top: 30, right: 10, bottom: 30, left: 100 }; 


    // Create SVG canvas
    var svg = d3.select("#parallel-coordinates").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setup x and y axes
    var y = {};
    var x = d3.scalePoint()
        .range([0, width - margin.left - margin.right])
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

    // Define line paths
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw lines with interactivity
    svg.selectAll(".line")
        .data(data)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d) { return color(d["Subject"]); })
        .style("opacity", 0.5)
        .on("mouseover", function(event, d) {
            d3.selectAll(".line").style("opacity", 0.1);
            d3.select(this).style("opacity", 1).style("stroke-width", "4px");
        })
        .on("mouseout", function() {
            d3.selectAll(".line").style("opacity", 0.5);
            d3.select(this).style("stroke-width", "2px");
        });

    // Add background color and axis style adjustments
    svg.selectAll(".axis .tick line, .axis .domain")
        .style("stroke", "black");
    svg.selectAll(".axis text")
        .style("font-size", "13px").style("font-family", "sans-serif").style("stroke", "black");

    // Create the legend in its dedicated SVG
    var legendSvg = d3.select("#legend-qbs").append("svg")
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
    var tooltip = d3.select("#tooltip");

    svg.selectAll(".line")
        .on("mouseover", function(event, d) {
            d3.selectAll(".line").style("opacity", 0.1);
            d3.select(this)
                .style("opacity", 1)
                .style("stroke-width", "4px");
    
            // Update the tooltip content and position it according to the mouse position
            tooltip.html(
                "<strong>Player:</strong> " + d["Subject"] + "<br>" +
                "<strong>Cmp/GP:</strong> " + d["Cmp/GP"] + "<br>" +
                "<strong>TD/GP:</strong> " + d["TD/GP"] + "<br>" +
                "<strong>Pass Rating:</strong> " + d["Pass Rating"]
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
