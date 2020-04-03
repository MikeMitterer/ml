// import { LoggerFactory } from "@mmit/logging";
import axios from 'axios';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';
import * as JSON5 from 'json5';
import * as fs from 'fs';
import pretty from "pretty";
import { LoggerFactory } from "@mmit/logging";

describe("kapitel3-diag-und-skalierung", () => {
    const logger = LoggerFactory.getLogger('test.unit.d3js.kapitel2-basics');

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML =
            '<body></body>';
    });

    // afterEach(() => {
    // });

    /**
     * d3.scaleLinear()
     *
     *      // Daten-Koordinaten
     *      .domain([])
     *
     *      // SVG-Koordinaten
     *      .range([])
     */
    test('ScaleLinear', () => {
        const filename = "scale-linear.svg";

        // set the dimensions and margins of the graph
        const margin = {top: 70, right: 30, bottom: 30, left: 40};
        const width = 600;
        const height = 400;

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

        const x = d3.scaleLinear()
            .range([0, width - margin.left - margin.right])
            .domain([0, 200])
        ;

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("transform", "translate(0,100)")
            .call(xAxisGenerator)
        ;

        const bars = svg
            .selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")

            // Die Verwendung der x-Funktion!!! garantiert dass wir die richtige
            // Skalierung verwenden
            .attr("x", x(0))
            .attr("y", (color, index) => (index) * 22)
            .attr("width", (color) => x(color.width))
            .attr("height", 20)
            .attr("fill", (color) => color.color)
        ;

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

    test('Scale Time', () => {
        const filename = "scale-time.svg";

        const width = 600;
        const height = 400;
        const margin = {top: 70, left: 30, bottom: 30, right: 40};
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
                .label {
                    font: bold 12px Verdana, Helvetica, Arial, sans-serif;
                }
            `)
        ;

        // Erste Gruppe damit das Diagramm als gesamtes in einer Gruppe ist
        const svg = element.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        ;

        const x = d3.scaleTime()
            // SVG Einheiten
            .range([0, canvas.width])
            // Einheiten aus dem Datenbereich
            .domain([new Date(1670, 0, 1), new Date(1920, 0, 1)])
        ;

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0,100)")
            .call(xAxisGenerator)
        ;

        const bars = svg.selectAll("rect")
                .data(composers)
                .enter()
                .append("rect")

                // Die Verwendung der x-Funktion!!! garantiert dass wir die richtige
                // Skalierung verwenden
                .attr("x", (composer) => x(composer.startDate))
                .attr("y", (composer, index) => (index) * 22)
                .attr("width", (composer) => x(composer.endDate) - x(composer.startDate))
                .attr("height", 20)
                .attr("fill", (composer) => composer.color)
            // .on("mouseover", function(composer): void {
            //     const bar = d3.select(this);
            //     svg.append("text")
            //         .attr("x", bar.attr("x"))
            //         .attr("y", bar.attr("y"))
            //         .text(composer.artist);
            // })
        ;

        // Correctly appending 
        const labels = svg.selectAll(".label")
            .data(composers)
            .enter()
            .append("text")

            .attr("x", (composer) => {
                // tslint:disable-next-line:no-shadowed-variable
                const width = x(composer.endDate) - x(composer.startDate);
                return x(composer.startDate) + width / 2;
            })
            .attr("y", (composer, index) => (index) * 22 + 14)
            // .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text((composer) => composer.artist)
        ;

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

    test('Scale ordinal / point', () => {
        const filename = "ratings.svg";

        const width = 600;
        const height = 400;
        const margin = {top: 70, left: 30, bottom: 30, right: 40};
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };

        const ratingFactors = ["disaster", "bad", "ok", "better", "perfect"];

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

        // scaleOrdinal würde hier auch funktionieren scalePoint spart aber Tipparbeit
        const x = d3.scalePoint()
            // SVG Einheiten
            .range([0, canvas.width])
            // Einheiten aus dem Datenbereich
            .domain(ratingFactors)
        ;

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0,100)")
            .call(xAxisGenerator)
        ;

        // Beim selectAll kommt eine leere Selection zurück da es noch keinen Circle gibt
        const circles = svg.selectAll("circle")
            .data(ratings)
            .enter()
            .append("circle")

            // Die Verwendung der x-Funktion!!! garantiert dass wir die richtige
            // Skalierung verwenden
            .attr("cx", (rating) => x(rating.rating) ?? 0)
            .attr("cy", 60)
            .attr("r", 10)
            .attr("fill", (rating) => rating.color)
        ;

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

    test('Pie chart', () => {
        const filename = "pie-chart.svg";

        const width = 600;
        const height = 400;
        const margin = {top: 70, left: 30, bottom: 30, right: 40};
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };

        // tslint:disable-next-line:no-shadowed-variable
        const colors = d3.scaleOrdinal(["#f44242", "#f4a641", "#f4e841", "#acf441", "#41f479", "#41f4f4", "#419af4"]);

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
            .attr("transform", `translate(${300}, ${160})`)
        ;

        const pie = d3.pie<Population>()
            .sort(null)
            .value((record) => record.population);

        const path = d3.arc<PieArcDatum<Population>>()
            .innerRadius(0)
            .outerRadius(150)
        ;

        // Beim selectAll kommt eine leere Selection zurück da es noch keinen Circle gibt
        const data = pie(worldPopulation);
        const arch = svg.selectAll(".arc")
            .data(data)
            .enter()

            .append("g")
            .attr("class", "arc")
        ;

        arch.append('path')
            .attr("d", path)
            .style("fill",
                (population) => colors(population.data.time))
        ;

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });

    test('Line Diagram', () => {
        const filename = "line-diagram.svg";

        const width = 600;
        const height = 400;
        const margin = {top: 30, left: 50, bottom: 30, right: 40};
        const canvas = {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };


        // noinspection DuplicatedCode
        const element = d3.select("body")
            .append("svg")
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", width).attr("height", height)
        ;

        element.append("style")
            .text(`
                svg {
                    background-color: red;    
                }
                .population_line {
                    fill: none;
                    stroke: white;
                    stroke-width: 2; 
                }
            `)
        ;

        // Erste Gruppe damit das Diagramm als gesamtes in einer Gruppe ist
        const svg = element.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        ;

        const x = d3.scaleTime()
            .range([0, 500])
            .domain([new Date("1950-01-01"), new Date("2000-01-01")]);

        const y = d3.scaleLinear()
            .range([0, 300])
            .domain([6, 0]);

        const xAxisGenerator = d3.axisBottom(x);
        const xAxis = svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0,320)")
            .call(xAxisGenerator);


        const yAxisGenerator = d3.axisLeft(y);
        const yAxis = svg.append("g")
            .attr("class", "y_axis")
            .attr("transform", "translate(0,20)")
            .call(yAxisGenerator);

        const lineGenerator = d3.line<Population>()
            .x(d => x(new Date(d.time)))
            .y(d => y(d.population));

        const path = svg.append("path")
            // Muss hier unbedingt als Array übergeben werden
            .data([worldPopulation])
            .attr("d", lineGenerator)
            .attr("class", "population_line");

        // @ts-ignore
        const svgString = (element.node()?.outerHTML) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        fs.writeFileSync(`tests/unit/_resources/${filename}`, pretty(svgString));
    });


});

const colors = [
    {
        "color": "#f44242",
        "width": 100
    },
    {
        "color": "#f4a641",
        "width": 200
    },
    {
        "color": "#f4e841",
        "width": 150
    },
    {
        "color": "#acf441",
        "width": 116
    }
];

const composers = [
    {
        "artist": "W. A. Mozart",
        "color": "#f44242",
        "startDate": new Date(1756, 0, 27),
        "endDate": new Date(1791, 11, 5),
    },
    {
        "artist": "A. Vivaldi",
        "color": "#f4a641",
        "startDate": new Date(1678, 2, 4),
        "endDate": new Date(1741, 6, 28)
    },
    {
        "artist": "A. Dvorak",
        "color": "#f4e841",
        "startDate": new Date(1841, 8, 8),
        "endDate": new Date(1904, 4, 1),
    },
    {
        "artist": "J. Haydn",
        "color": "#acf441",
        "startDate": new Date(1732, 2, 31),
        "endDate": new Date(1809, 4, 31)
    }
];

const ratings = [
    {
        "color": "#f44242",
        "rating": "disaster"
    },
    {
        "color": "#f4cd41",
        "rating": "ok"
    },
    {
        "color": "#d6f441",
        "rating": "better"
    },
    {
        "color": "#4cf441",
        "rating": "perfect"
    }
];

type Population = { time: string, population: number; };

const worldPopulation: Population[] = [
    {
        "time": "1950-01-01",
        "population": 2.53
    },
    {
        "time": "1960-01-01",
        "population": 3.03
    },
    {
        "time": "1970-01-01",
        "population": 3.69
    },
    {
        "time": "1990-01-01",
        "population": 4.45
    },
    {
        "time": "2000-01-01",
        "population": 5.32
    }
];

