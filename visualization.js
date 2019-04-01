
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  // d3.csv("football.csv").then(function(data) {
  //   // Write the data to the console for debugging:
  //   console.log(data);

  //   // Call our visualize function:
  //   visualize(data);
  // });
  const data = [
    {department: "Enginerring", major: "CS", startYear: 1980, endYear: 2013, startData: 2.3, endData: 9.7, startFemalePercentage: 0.36, endFemalePercentage: 0.64}
  ];


  visualize(data);
});


const visualize = function(data) {
    const config = {
        margin: {
            top: 100,
            right: 50,
            bottom: 150,
            left: 50
        },
        circleRadius: 3
    };

    config.width = 250 - config.margin.left - config.margin.right;
    config.height = 500 - config.margin.top - config.margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 10]);

    // const colorScale = d3.scaleLinear()
    //     .domain([0,1])
    //     .range(['#f44242', '#417cf4']);

    svg.append('g')
        .call(d3.axisLeft(yScale));

    svg.append("g")
        .attr("transform", "translate( " + config.width + ", 0 )")
        .call(d3.axisRight(yScale));

    const xScale = d3.scaleBand()
        .range([0, config.width])
        .domain(data.map((row) => row.opp))
        .padding(0.2);

    const slopeGroups = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "slope-group");
        // .attr("id", function(d, i) {
        //     console.log(d, i);
        //     d.id = "group" + i;
        //     d.values = [];
        // });

    const label = slopeGroups.append("text")
      .attr("class", "label")
      .style('position','absolute')
      .attr("x", (config.width / 2))
      .attr("y", d => yScale((d.startData+d.endData)/2)-50)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("College of Engineering");

    const labelLine = slopeGroups.append("line")
      .attr("class", "label-line")
      .attr("x1", config.width/2)
      .attr("y1", d => yScale((d.startData+d.endData)/2))
      .attr("x2", config.width/2)
      .attr("y2", d => yScale((d.startData+d.endData)/2)-40)
      .style("stroke", "black")
      .style("stroke-width", 3);

    const slopeLines = slopeGroups.append("line")
      .attr("class", "slope-line")
      .attr("x1", 0)
      .attr("y1", d => yScale(d.startData))
      .attr("x2", config.width)
      .attr("y2", d => yScale(d.endData))
      .attr('opacity', 0.6)
      .style("stroke", "black")
      .style("stroke-width", 3)
      .on('mouseenter', function () {
        d3.select(this)
            .attr('opacity', 1.0)
            .style("stroke-width", 5)
      })
      .on('mouseleave', function () {
        d3.select(this)
            .attr('opacity', 0.6)
            .style("stroke-width", 3)
      });

    // var titlesLeft = svg.append("g")
    //     .attr("class", "title");
    //
    // titlesLeft.append("text")
    //     .attr("text-anchor", "end")
    //     .attr("dx", -7.5)
    //     .attr("dy", -config.margin.top / 4)
    //     .text("1980");

    const leftSlopeCircle = slopeGroups.append("circle")
        .attr("r", 3)
        .attr("cy", d => yScale(d.startData))
        .style("fill", "black");

    const rightSlopeCircle = slopeGroups.append("circle")
        .attr("r", 3)
        .attr("cx", config.width)
        .attr("cy", d => yScale(d.endData))
        .style("fill", "black");

    svg.append("text")
        .attr("x", (config.width / 2))
        .attr("y", 10 - (2 * config.margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("College of Engineering");

    var titlesLeft = svg.append("g")
        .attr("class", "title");

    titlesLeft.append("text")
        .attr("text-anchor", "end")
        .attr("dx", -7.5)
        .attr("dy", -config.margin.top / 4)
        .text("1980");

    var titlesRight = svg.append("g")
        .attr("class", "title");

    titlesRight.append("text")
        .attr("text-anchor", "end")
        .attr("dx", config.width + config.margin.right - 5)
        .attr("dy", -config.margin.top / 4)
        .text("2018");
};
