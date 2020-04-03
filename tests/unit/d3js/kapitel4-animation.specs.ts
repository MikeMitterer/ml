import { LoggerFactory } from "@mmit/logging";
import axios from 'axios';
import * as d3 from 'd3';
import * as JSON5 from 'json5';
import * as fs from 'fs';
import * as path from 'path';
import pretty from "pretty";

describe("D3 Basics", () => {
    const logger = LoggerFactory.getLogger('test.unit.d3js.kapitel4-animation');

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML =
            '<body></body>';
    });

    // afterEach(() => {
    // });

    test('Animation', () => {
        const filename = "animation.svg";

        const width = 600;
        const height = 400;
        const margin = { top: 70, left: 30, bottom: 30, right: 40 };
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };

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

        const bar1 = svg.append("rect")
            .attr("fill", "blue")
            .attr("x", 100)
            .attr("y", 20)
            .attr("height", 20)
            .attr("width", 10)
        ;

        const bar2 = svg.append("rect")
            .attr("fill", "blue")
            .attr("x", 120)
            .attr("y", 20)
            .attr("height", 20)
            .attr("width", 10)
        ;

        update();

        function update(): void {
            bar1.transition()
                .ease(d3.easeLinear)
                .duration(2000)
                .attr("height",100)
            ;

            bar2.transition()
                .ease(d3.easeLinear)
                .duration(2000)
                .delay(2000)
                .attr("height",100)
            ;
        }

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

});
