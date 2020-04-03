import { LoggerFactory } from "@mmit/logging";
import axios from 'axios';
// import { generate } from "c3";
import * as dataForge from 'data-forge';
import * as d3 from 'd3';
import * as JSON5 from 'json5';
// import * as c3 from 'c3';
import * as fs from 'fs';
import pretty from "pretty";
import * as path from 'path';

// const c3 = require('c3');
// const d3Node = require('d3-node');

// For the 'plot' function.
import data_forge_plot from "data-forge-plot";

// For the 'sma' function.
import data_forge_indicators from "data-forge-indicators";

type Price = { price: number; };

describe("data-forge-plot", () => {
    const logger = LoggerFactory.getLogger('test.data-forge-plot');

    const jsonFile = path.join(__dirname, '..', '_resources', '1_OneNujm.json5');
    const json = JSON5.parse(fs.readFileSync(jsonFile,"utf8").toString()) as Price[];

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("d3 read json", () => {
        expect(json[0] ).toStrictEqual({ price: 75 } );
    });

    test("Plot sample", async () => {
        const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo&datatype=csv";

        const response = (await axios.get(url)).data; // Request the data from Alpha Vantage.
        const csv = d3.csvParse(response, (row) => {
            return {
                row
                // timestamp: row.timestamp,
                // open: parseInt((row.open ?? '0').replace('.',''), 10),
            };
        });
        logger.info("Retreived:", csv);


        const df = dataForge.fromCSV(response, { dynamicTyping: true }) // Deserialize CSV data.
            .parseDates("timestamp", "YYYY-MM-DD"); // Parse dates from strings.

        logger.info("Retreived:");
        logger.info(df.head(10).toStrings("timestamp", "YYYY-MM-DD").toString());

    });

    // test("d3", () => {
    //     const d3n = new d3Node();      // initializes D3 with container element
    //     d3n.createSVG(10, 20).append('g'); // create SVG w/ 'g' tag and width/height
    //     logger.info(d3n.svgString());
    //     // expect( ).toBe( );
    // });

    test("d3 via jsdom", () => {
        // Set up our document body
        document.body.innerHTML =
            '<div id="svgcontainer"></div>';

        const width = 300;
        const height = 300;
        const svg = d3.select("#svgcontainer")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height);

        svg.append("line")
            .attr("x1", 100)
            .attr("y1", 100)
            .attr("x2", 200)
            .attr("y2", 200)
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", 10);

        // Append circle
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 50)
            .attr("r", 20)
            .attr("fill", "green");

        // @ts-ignore
        const svgString = (svg.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync('tests/unit/_resources/sample.svg', pretty(svgString));

        // logger.info();

    });

    // Sample: https://www.d3-graph-gallery.com/graph/histogram_basic.html
    // API - Histogram: https://github.com/d3/d3-array/blob/v1.2.4/README.md#histogram
    // chartjs - histogram: https://stackoverflow.com/questions/51880101/make-a-histogram-in-chart-js
    // LiveBook: https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-5/11
    // D3 Discover: https://d3-discovery.net/
    
    test("Histogram", () => {
        const filename = "histogram.svg";

        // Set up our document body
        document.body.innerHTML =
            '<div id="svgcontainer"></div>';

        const width = 600;
        const height = 400;
        const margin = { top: 30, left: 50, bottom: 30, right: 30 };
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };

        // Wird ganz oben von einem json5-File gelesen
        // const data = json.map((price) => ({ price: `${price}` }));
        const data = json.map((price) => price.price);

        // noinspection DuplicatedCode
        const element = d3.select("body")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height);

        element.append("style")
            .text(`
            `)
        ;

        // Erste Gruppe damit das Diagramm als gesamtes in einer Gruppe ist
        const svg = element.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        ;

        const domain = [0, 1000];

        // - X axis: scale and draw ----------------------------------------------------------------
        const x = d3.scaleLinear()
            .range([0, canvas.width])

            // can use this instead of 1000 to have the max of data:
            // d3.max(data, function(d) { return +d.price })
            .domain(domain)
        ;

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("transform", `translate(${0}, ${canvas.height})`)
            .call(xAxisGenerator);

        // - Histogram (vor der Y-Achse da die Daten für Y benötigt werden -------------------------
        // set the parameters for the histogram
        // and apply this function to data to get the bins
        const histogram = d3.histogram()
            .domain([0, 1000])
            .thresholds(x.ticks(50))
            (data)
        ;

        // - Y axis: scale and draw ----------------------------------------------------------------
        const yMax = d3.max(histogram, d => d.length) ?? 0;
        
        const y = d3.scaleLinear()
            .range([canvas.height, 0])
            .domain([0, yMax])
        ;

        const yAxisGenerator = d3.axisLeft(y);
        const yAxis = svg.append("g")
            .attr("transform", `translate(${0}, ${0})`)
            .call(yAxisGenerator)
        ;

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(histogram)
            .enter()
            .append("rect")

            // Daten für die jeweiligen Rects...
            .attr("x", 1)
            .attr("transform", d => {
                return "translate(" + x(d.x0 ?? 0) + "," + y(d.length) + ")";
            })
            .attr("width", d => {
                const barWidth = x(d.x1 ?? 0) - x(d.x0 ?? 0);
                return barWidth > 0 ? barWidth - 1 : 0;
            })
            .attr("height", d => {
                return canvas.height - y(d.length);
            })
            .style("fill", "#ff0000")
        ;

        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync('tests/unit/_resources/histogram.svg', pretty(svgString));

        // expect( ).toBe( );
    });

    test("Histogram II", () => {
        // Wird ganz oben von einem json5-File gelesen
        // const data = json.map((price) => ({ price: `${price}` }));
        const data = json.map((price) => price.price);

        // set the dimensions and margins of the graph
        const margin = { top: 40, right: 30, bottom: 30, left: 40 };
        const width = 450 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const yMax = d3.max(data) as number;

        const x = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        // set the parameters for the histogram
        const histogram = d3.histogram()
            // then the numbers of bins
            .thresholds(x.ticks(10))
            (data);

        logger.info("Data", histogram);
    });
});
