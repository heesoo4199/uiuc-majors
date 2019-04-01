$(function() {
  d3.csv("majors_slope_data.csv").then(majors => {
    majors.forEach((major) => {
        major.startData = parseFloat(major.startData);
        major.endData = parseFloat(major.endData);

        major.startYear = parseFloat(major.startYear);
        major.endYear = parseFloat(major.endYear);

        major.startFemale = parseFloat(major.startFemale);
        major.endFemale = parseFloat(major.endFemale);
    });

    majors = majors.filter(major => major.endYear == 2018);

    visualize(majors, "#chart-eng", "Engineering");
    visualize(majors, "#chart-las", "LAS");
    visualize(majors, "#chart-edu", "Education");
    visualize(majors, "#chart-bus", "Business + Media");
    visualize(majors, "#chart-aces", "ACES");
    visualize(majors, "#chart-art", "Fine and Applied Arts");
    visualize(majors, "#chart-oth", "Other");

    visualizeKey();
  });
});

const colorScale = d3.scaleLinear()
    .domain([0, 0.25, 0.5, 0.75, 1])
    .range(['#10a7dd', '#72cde8', '#bbbbbb', '#e8a099', '#ff0033']);

const visualizeKey = () => {
    const config = {
        margin: {
            top: 0,
            right: 25,
            bottom: 0,
            left: 25
        },
        circleRadius: 5
    };

    config.width = 250 - config.margin.left - config.margin.right;
    config.height = 50;

    var key = d3.select("#color-key")
      .append("svg")
      .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "key-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorScale(0))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "25%")
      .attr("stop-color", colorScale(0.25))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", colorScale(0.5))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "75%")
      .attr("stop-color", colorScale(0.75))
      .attr("stop-opacity", 1);

      legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorScale(1))
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", config.width)
      .attr("height", config.height - 30)
      .style("fill", "url(#key-gradient)")
      .attr("transform", "translate(0,10)");

    var y = d3.scaleLinear()
      .range([config.width, 0])
      .domain([100, 0]);

    var yAxis = d3.axisBottom()
      .scale(y)
      .ticks(5);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,30)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("axis title");
};


const visualize = function(majorsData, chartId, college) {
    let data = majorsData.filter(major => major.college == college);

    if (college == 'Other') {
        data = majorsData.filter(major => {
            return major.college == "Aviation" ||
                   major.college == "Applied Life Sciences" ||
                   major.college == "Labor and Industrial Relations" ||
                   major.college == "LM" ||
                   major.college == "iSchool" ||
                   major.college == "Law" ||
                   major.college == "Medicine" ||
                   major.college == "LN" ||
                   major.college == "DGS" ||
                   major.college == "Social Work" ||
                   major.college == "Applied Health Sciences";
        });
    } else if (college == 'Business + Media') {
        data = majorsData.filter(major => {
            return major.college == "Business" ||
                   major.college == "Media";
        });
    }

    const config = {
        margin: {
            top: 50,
            right: 50,
            bottom: 100,
            left: 50
        },
        circleRadius: 5
    };

    config.width = 250 - config.margin.left - config.margin.right;
    config.height = 400 - config.margin.top - config.margin.bottom;

    const svg = d3.select(chartId)
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    d3.select(chartId).on('mouseleave', function (d) {
        d3.selectAll(".slope-line")
            .style("stroke-width", 3);

        d3.selectAll(".major-label")
            .style('visibility', 'hidden');

        d3.selectAll(".major-label-line")
            .style('visibility', 'hidden');
    });

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 5]);

    const defs = svg.append("defs");

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
      .style("stroke-width", 3)
      .on('mouseenter', function (d) {
        d3.selectAll(".slope-line")
            .style("stroke-width", 3);

        d3.selectAll(".major-label")
            .style('visibility', 'hidden');

        d3.selectAll(".major-label-line")
            .style('visibility', 'hidden');

        d3.select(this)
            .style("stroke-width", 5);

        d3.select("#label" + d.major.replace(/\W+/g, ""))
            .style('visibility', 'visible');

        d3.select("#labelLine" + d.major.replace(/\W+/g, ""))
            .style('visibility', 'visible');
      });
      
      slopeLines.style('stroke', (d, i) => {
        const gradientID = `gradient${d.major.replace(/\W+/g, "")}`;
    
        const linearGradient = defs.append('linearGradient')
            .attr('id', gradientID)
            .selectAll('stop') 
            .data([                             
              {offset: '0%', color: colorScale(d.startFemale) },      
              {offset: '100%', color: colorScale(d.endFemale) }    
            ])                  
            .enter().append('stop')
            .attr('offset', d => d.offset) 
            .attr('stop-color', d => d.color);
    
        return `url(#${gradientID})`;
      });

    const leftSlopeCircle = slopeGroups.append("circle")
        .attr("r", config.circleRadius)
        .attr("cx", d => xScale(d.startYear))
        .attr("cy", d => yScale(d.startData))
        .style("fill", d => colorScale(d.startFemale));

    const rightSlopeCircle = slopeGroups.append("circle")
        .attr("r", config.circleRadius)
        .attr("cx", d => xScale(d.endYear))
        .attr("cy", d => yScale(d.endData))
        .style("fill", d => colorScale(d.endFemale));

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
        .attr("dx", config.width + config.margin.left / 1.2)
        .attr("dy", config.height + config.margin.top / 2)
        .text("2018");
};
