import { LoggerFactory } from "@mmit/logging";
import axios from 'axios';
import * as d3 from 'd3';
import * as JSON5 from 'json5';
import * as fs from 'fs';
import * as path from 'path';
import pretty from "pretty";

describe("D3 Basics", () => {
    const logger = LoggerFactory.getLogger('test.unit.d3js.kapitel2-basics');

    const jsonFile = path.join(__dirname, '..', '_resources', '1_OneNujm.json5');
    // const json = JSON5.parse(fs.readFileSync(jsonFile,"utf8").toString()) as Price[];

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML =
            '<body></body>';
    });

    // afterEach(() => {
    // });

    test("From Array", () => {
        const filename = "from-array.svg";

        const width = 500;
        const height = 400;

        const colors = ['red', "orange", "white", "orange", "red", "white"];

        // noinspection DuplicatedCode
        const svg = d3.select("body")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height);

        svg.append("style")
            .text(`
            `)
        ;

        // Es ist keine Selection vorhanden.
        // Eine leere Selection kommt retour

        svg.selectAll("rect")
            .data(colors)
            // Enter bedient alle NEUEN Datensätze (in diesem Fall alle)
            .enter()
            .append("rect")
            .attr("x", 15)
            .attr("y", (color, index) => index * 35)
            .attr("width", 200)
            .attr("height", 30)
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", 1)
            .style("fill", (color, index) => color)
            ;

        // @ts-ignore
        const svgString = (svg.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

    test('From Json', () => {
        const filename = "from-json.svg";

        const colors = [
            {
                "color": "red",
                "width": 100
            },
            {
                "color": "orange",
                "width": 200
            },
            {
                "color": "white",
                "width": 150
            },
            {
                "color": "orange",
                "width": 116
            }
        ];

        const width = 500;
        const height = 400;

        // noinspection DuplicatedCode
        const svg = d3.select("body")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height);

        svg.append("style")
            .text(`
            `)
        ;

        svg.selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")
            .attr("x", 15)
            .attr("y", (color, index) => index * 35)
            .attr("width", (color) => color.width)
            .attr("height", 30)
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", 1)
            .style("fill", (color, index) => color.color)
        ;


        // @ts-ignore
        const svgString = (svg.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

});
