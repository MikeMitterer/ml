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

    test("Hello World", () => {
        const filename = "hello-world.svg";

        const width = 300;
        const height = 300;
        const svg = d3.select("body")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height);

        svg.append("style")
            .text(`
                rect {
                    fill: green;
                }
            `)
        ;

        svg.append("rect")
            .attr("x", 15)
            .attr("y", 15)
            .attr("width", 200)
            .attr("height", 200)
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", 1)
            .attr('transform', `translate(${100},${0})`)
            .attr('transform', `rotate(45, 92.5, 92.5)`)
        ;

        svg.append("line")
            .attr("x1", 10)
            .attr("y1", 10)
            .attr("x2", 30)
            .attr("y2", 60)
            .style("stroke", "rgb(255,0,0)")
        ;

        svg.append("path")
            .attr("d", 'M150 50 L75 200 L255 200 Z')
            .style("stroke", "rgb(0,255,0)")
            .style("stroke-width", 2)
            .attr('transform', `scale(1.5,1)`)
        ;

        // Translate - verschieben
        // Scale - skalieren
        // Transform - Drehen
        // Rotate - ...
        
        // svg.append(svg.text("Hallo"))
        //     .attr("x", 15)
        //     .attr("y", 15)
        // ;

        // @ts-ignore
        const svgString = (svg.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

});
