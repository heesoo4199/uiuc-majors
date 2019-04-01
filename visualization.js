
$(function() {
  d3.csv("majors_cleaned.csv").then(function(majors_data) {
    d3.csv("total_enrollment.csv").then(function(enrollment_data) {
        const majors = {};
        const cleanData = [];

        majors_data.forEach((row) => {
            if (!(row.Major in majors)) {
                majors[row.Major] = {startYear: parseFloat(row.Year), endYear: parseFloat(row.Year), startData: parseFloat(row.Total), endData: parseFloat(row.Total), startFemale: parseFloat(row.Female), endFemale: parseFloat(row.Female), college: row.College};
                return;
            }

            if (row.Year < majors[row.Major].startYear) {
                majors[row.Major].startYear = parseFloat(row.Year);
                majors[row.Major].startData = parseFloat(row.Total);
                majors[row.Major].startFemale = parseFloat(row.Female);
            } else if (row.Year > majors[row.Major].endYear) {
                majors[row.Major].endYear = parseFloat(row.Year);
                majors[row.Major].endData = parseFloat(row.Total);
                majors[row.Major].endFemale = parseFloat(row.Female);
            }
        });

        const enrollment = {};
        enrollment_data.forEach((row) => {
            enrollment[row.Year] = parseInt(row.Total);
        });

        Object.entries(majors).forEach((pair) => {
            const dataToAdd = pair[1];
            dataToAdd.major = pair[0];

            dataToAdd.startData = 100 * dataToAdd.startData / enrollment[dataToAdd.startYear];
            dataToAdd.endData = 100 * dataToAdd.endData / enrollment[dataToAdd.endYear];
            
            if (dataToAdd.college == "Engineering") {
                cleanData.push(dataToAdd);
            }
        })

        console.log(cleanData);

        visualize(cleanData);
    });
  });
//   const data = [
//     {department: "Enginerring", major: "CS", startYear: 1980, endYear: 2013, startData: 2.3, endData: 9.7, startFemalePercentage: 0.36, endFemalePercentage: 0.64}
//   ];
});


const visualize = function(data) {
    const config = {
        margin: {
            top: 100,
            right: 50,
            bottom: 100,
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
      .style("visibility", "hidden")
      .text("College of Engineering");

    const labelLine = slopeGroups.append("line")
      .attr("class", "label-line")
      .attr("x1", config.width/2)
      .attr("y1", d => yScale((d.startData+d.endData)/2))
      .attr("x2", config.width/2)
      .attr("y2", d => yScale((d.startData+d.endData)/2)-40)
      .style("visibility", "hidden")
      .style("stroke", "black")
      .style("stroke-width", 3);

    const slopeLines = slopeGroups.append("line")
      .attr("class", "slope-line")
      .attr("x1", d => xScale(d.startYear))
      .attr("y1", d => yScale(d.startData))
      .attr("x2", d => xScale(d.endYear))
      .attr("y2", d => yScale(d.endData))
      .attr('opacity', 0.6)
      .style("stroke", "black")
      .style("stroke-width", 3)
      .on('mouseenter', function () {
        d3.select(this)
            .attr('opacity', 1.0)
            .style("stroke-width", 5)
        label.style("visibility", "visible")
        labelLine.style("visibility", "visible")
      })
      .on('mouseleave', function () {
        d3.select(this)
            .attr('opacity', 0.6)
            .style("stroke-width", 3)
        label.style("visibility", "hidden")
        labelLine.style("visibility", "hidden")
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
        .text("College of Engineering");

    const titlesLeft = svg.append("g")
        .attr("class", "title");

    titlesLeft.append("text")
        .attr("text-anchor", "end")
        .attr("dx", - 7.5)
        .attr("dy", - config.margin.top / 4)
        .text("1980");

    const titlesRight = svg.append("g")
        .attr("class", "title");

    titlesRight.append("text")
        .attr("text-anchor", "end")
        .attr("dx", config.width + config.margin.right - 5)
        .attr("dy", -config.margin.top / 4)
        .text("2018");
};
