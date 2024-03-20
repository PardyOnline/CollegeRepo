// Load the CSV file
d3.csv("2007 WR.csv").then(function(data) {
    // Convert percentage strings to numbers and other fields to numbers
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

    
    // Extract the list of dimensions and create a scale for each
    var dimensions = ["Tgt", "Rec", "Yds", "TD", "Fmb", "Ctch%", "Succ%", "Y/R", "Y/Tgt" ]
    
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 10, bottom: 10, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
    // Append the svg object to the body of the page
    var svg = d3.select("#parallel-coordinates1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var y = {}; // Creates y axis as empty object
  
    // Build the X scale -> it find the best position for each Y axis
    var x = d3.scalePoint()
      .range([0, width - margin.left - margin.right])
      .padding(1)
      .domain(dimensions);

    dimensions.forEach(function(d) {
            var scale = d.includes("%") ? d3.scaleLinear().domain([0, 1]) : d3.extent(data, function(p) { return +p[d]; });
            
            y[d] = d3.scaleLinear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
                .range([height, 0]);

            // Define axis with percentage formatting for percentage scales
            var axis = d.includes("%") ? d3.axisLeft(y[d]).tickFormat(d3.format(".0%")) : d3.axisLeft(y[d]);

            // Draw axes and add Titles
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
  
    // The color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Function to draw the path
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return  [x(p), y[p](d[p])]; }));
    }

    // Draw Lines
    var lines = svg.selectAll(".line")
        .data(data)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d) { return color(d["Player"]); }) // Used to give each WR a different color
        .style("opacity", 0.5)

    // Add interactivity for highlighting lines
    lines.on("mouseover", function(event, d) {
        d3.selectAll(".line").style("opacity", 0.1);
        d3.select(this).style("opacity", 1).style("stroke-width", "4px");
    }).on("mouseout", function(d) {
        d3.selectAll(".line").style("opacity", 0.5);
        d3.select(this).style("stroke-width", "2px");
    });

    // Add background color to the SVG
    d3.select("#parallel-coordinates1")
        .style("background-color", "black")

    // Style the axes 
    svg.selectAll(".axis .tick line")
        .style("stroke", "white");   
        
    svg.selectAll(".axis .domain")
        .style("stroke", "white");

    // Style the axis labels
    svg.selectAll(".axis text")
        .style("font-size", "13px")
        .style("font-family", "aptos")
        .style("stroke", "white");

    // Diagram legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width -margin.right - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)

    legend.append("text")
        .attr("x", width - margin.right- 26)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("stroke", "white")
        .text(function(d) {return d; });
});
    