import { LoggerFactory } from "@mmit/logging";
import axios from 'axios';
import * as d3 from 'd3';
import * as JSON5 from 'json5';
import * as fs from 'fs';
import * as path from 'path';
import pretty from "pretty";

type Titanic = {
    survived: boolean,
    sex: string,
    age: number,
    n_siblings_spouses: number,
    parch: number,
    fare: number,
    class: string,
    deck: string,
    embark_town: string,
    alone: string
};

describe("ML Course - Titanic",  () => {
    const logger = LoggerFactory.getLogger('test.unit.d3js.kapitel4-animation');

    const csvFile = path.join(__dirname, '..', '_resources', "titanic", 'all.csv');

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML =
            '<body></body>';
    });

    // afterEach(() => {
    // });

    // Each bar has a length proportional to the number of elements
    // of each bucket
    test('Training - Histogram', async () => {
        const filename = "titanic-age.svg";

        const width = 600;
        const height = 400;
        const margin = { top: 50, left: 40, bottom: 50, right: 30 };
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };

        // - Data ----------------------------------------------------------------------------------
        const csv = d3.csvParse(fs.readFileSync(csvFile, "utf8").toString(),
            (row): Titanic => {

            return {
                survived: (row.survived ?? "0") !== "0",
                sex: row.sex ?? "unknown",
                age: parseFloat(row.age ?? "0"),
                n_siblings_spouses: parseInt(row.n_siblings_spouses ?? "0", 10),
                parch: parseInt(row.parch ?? "0", 10),
                fare: parseFloat(row.fare ?? "0"),
                class: (row.class ?? "unknown"),
                deck: (row.deck ?? "unknown"),
                embark_town: (row.embark_town ?? "unknown"),
                alone: row.alone ?? "unknown",
            };
        });

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

        // - Diagramm ------------------------------------------------------------------------------

        const data = csv.map((titanic) => titanic.age);
        const maxAge = Math.max(...data);

        // - X axis: scale and draw ----------------------------------------------------------------
        const x = d3.scaleLinear()
            .range([0, canvas.width])

            // can use this instead of 1000 to have the max of data:
            // d3.max(data, function(d) { return +d.price })
            .domain([0, maxAge])
        ;

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("transform", `translate(${0}, ${canvas.height})`)
            .call(xAxisGenerator);

        // - Histogram (vor der Y-Achse da die Daten für Y benötigt werden -------------------------
        // set the parameters for the histogram
        // and apply this function to data to get the bins
        const histogram = d3.histogram()
            .domain([0, maxAge])
            // [0, 10, 20, 30, 40, 50, 60, 70, 80]
            .thresholds(x.ticks(20))
            (data)
        ;

        // - Y axis: scale and draw ----------------------------------------------------------------
        const yMax = d3.max(histogram, d => Math.trunc(d.length / 10) * 10 + 10) ?? 0;

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

        // Correctly appending
        const labels = svg.selectAll(".label")
            .data(histogram.slice(0, -1))
            .enter()
            .append("text")

            .attr("x", (rect): number => {
                const barWidth = x(rect.x1 ?? 0) - x(rect.x0 ?? 0);
                return barWidth / 2;
            })
            .attr("transform", d => {
                return `translate(${x(d.x0 ?? 0)},${y(d.length) - 10})`;
            })
            .attr("text-anchor", "middle")
            .text((rect) => {
                return `${rect.length}`;
                // return `${rect.x0}-${rect.x1}`;
            })
        ;

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });


});
