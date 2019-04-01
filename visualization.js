$(function() {
  d3.csv("majors_slope_data.csv").then(majors => {
    const colleges = {};

    majors.forEach((major) => {
        major.startData = parseFloat(major.startData);
        major.endData = parseFloat(major.endData);

        major.startYear = parseFloat(major.startYear);
        major.endYear = parseFloat(major.endYear);

        major.startFemale = parseFloat(major.startFemale);
        major.endFemale = parseFloat(major.endFemale);

        colleges[major.college] = 1;
    });

    console.log(Object.keys(colleges));

    visualize(majors, "#chart-eng", "Engineering");
    visualize(majors, "#chart-eng", "LAS");
    visualize(majors, "#chart-edu", "Education");
    visualize(majors, "#chart-bus", "Business");
    visualize(majors, "#chart-media", "Media");
    visualize(majors, "#chart-aces", "ACES");
    visualize(majors, "#chart-avi", "Aviation");
    visualize(majors, "#chart-art", "Fine and Applied Arts");
    visualize(majors, "#chart-ahs", "Applied Health Sciences");
    visualize(majors, "#chart-als", "Applied Life Sciences");
    visualize(majors, "#chart-lir", "Labor and Industrial Relations");
    visualize(majors, "#chart-lm", "LM");
    visualize(majors, "#chart-isc", "iSchool");
    visualize(majors, "#chart-law", "Law");
    visualize(majors, "#chart-med", "Medicine");
    visualize(majors, "#chart-ln", "LN");
    visualize(majors, "#chart-dgs", "DGS");
    visualize(majors, "#chart-soc", "Social Work");
  });
});


const visualize = function(majorsData, chartId, college) {
    const data = majorsData.filter(major => major.college == college);

    const config = {
        margin: {
            top: 50,
            right: 100,
            bottom: 100,
            left: 100
        },
        circleRadius: 2.5
    };

    config.width = 350 - config.margin.left - config.margin.right;
    config.height = 500 - config.margin.top - config.margin.bottom;

    const svg = d3.select(chartId)
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 5]);

    // const colorScale = d3.scaleLinear()
    //     .domain([0,1])
    //     .range(['#f44242', '#417cf4']);

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));
    
    svg.append("g")
        .attr("transform", "translate( " + config.width + ", 0 )")
        .call(d3.axisRight(yScale).ticks(5));

    const xScale = d3.scaleLinear()
        .range([0, config.width])
        .domain([1980, 2018]);

    const slopeGroups = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "slope-group");

    const label = slopeGroups.append("text")
      .attr("class", "major-label")
      .attr("x", d => xScale((d.startYear+d.endYear)/2))
      .attr("y", d => yScale((d.startData+d.endData)/2)-30)
      .attr("id", d => "label" + d.major.replace(/\W+/g, ""))
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("visibility", "hidden")
      .text(d => d.major);

    const labelLine = slopeGroups.append("line")
      .attr("class", "major-label-line")
      .attr("x1", d => xScale((d.startYear+d.endYear)/2))
      .attr("y1", d => yScale((d.startData+d.endData)/2))
      .attr("x2", d => xScale((d.startYear+d.endYear)/2))
      .attr("y2", d => yScale((d.startData+d.endData)/2)-20)
      .attr("id", d => "labelLine" + d.major.replace(/\W+/g, ""))
      .style("visibility", "hidden")
      .style("stroke", "black")
      .style("stroke-width", 2);

    const slopeLines = slopeGroups.append("line")
      .attr("class", "slope-line")
      .attr("x1", d => xScale(d.startYear))
      .attr("y1", d => yScale(d.startData))
      .attr("x2", d => xScale(d.endYear))
      .attr("y2", d => yScale(d.endData))
      .attr('opacity', 0.6)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on('mouseenter', function (d) {
        d3.selectAll(".slope-line")
            .attr('opacity', 0.6)
            .style("stroke-width", 2);

        d3.selectAll(".major-label")
            .style('visibility', 'hidden');

        d3.selectAll(".major-label-line")
            .style('visibility', 'hidden');

        d3.select(this)
            .attr('opacity', 1.0)
            .style("stroke-width", 3);

        d3.select("#label" + d.major.replace(/\W+/g, ""))
            .style('visibility', 'visible');

        d3.select("#labelLine" + d.major.replace(/\W+/g, ""))
            .style('visibility', 'visible');
      });

    const leftSlopeCircle = slopeGroups.append("circle")
        .attr("r", config.circleRadius)
        .attr("cx", d => xScale(d.startYear))
        .attr("cy", d => yScale(d.startData))
        .style("fill", "black");

    const rightSlopeCircle = slopeGroups.append("circle")
        .attr("r", config.circleRadius)
        .attr("cx", d => xScale(d.endYear))
        .attr("cy", d => yScale(d.endData))
        .style("fill", "black");

    svg.append("text")
        .attr("x", (config.width / 2))
        .attr("y", 10 - (2 * config.margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(college);

    const titlesLeft = svg.append("g")
        .attr("class", "title")
        .append("text")
        .attr("text-anchor", "end")
        .attr("dx", - 7.5)
        .attr("dy",  config.height + config.margin.top / 2)
        .text("1980");

    const titlesRight = svg.append("g")
        .attr("class", "title")
        .append("text")
        .attr("text-anchor", "end")
        .attr("dx", config.width + config.margin.right / 2)
        .attr("dy", config.height + config.margin.top / 2)
        .text("2018");
};
