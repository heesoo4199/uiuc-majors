
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  // d3.csv("football.csv").then(function(data) {
  //   // Write the data to the console for debugging:
  //   console.log(data);

  //   // Call our visualize function:
  //   visualize(data);
  // });
  const data = [
    {major: "CS", startYear: 1980, endYear: 2013, startData: 2.3, endData: 10.7, startFemalePercentage: 0.4, endFemalePercentage: 0.64}
  ];

  visualize(data);
});


var visualize = function(data) {
  // Boilerplate:
  var margin = { top: 50, right: 50, bottom: 150, left: 50 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]);

    // const colorScale = d3.scaleLinear()
    //     .domain([0,1])
    //     .range(['#f44242', '#417cf4']);

    svg.append('g')
        .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((row) => row.opp))
        .padding(0.2)

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em");
        // .attr("transform", "rotate(45)")
        // .style("text-anchor", "start");

    svg.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (row) => xScale(row.opp))
        .attr('y', (row) => yScale(row.ratio))
        .attr('height', (row) => height - yScale(row.ratio))
        .attr('width', xScale.bandwidth());
        // .attr('fill', function (d) {
        //   return colorScale(d.ratio);
        // });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px")
        .style("fill", "#417cf4")
        .style("text-decoration", "underline")  
        .text("Fighting Illini Win Percentage vs Most Played Teams");
};