import * as d3 from "d3";

interface Config {
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  metrics: string[];
  accessor: string;
}

interface DataPoint {
  date: string;
  rating_metrics: { [key: string]: number };
}

interface ParsedDataPoint {
  date: Date;
  metrics: { [key: string]: number };
}

const colors = d3.scaleOrdinal(d3.schemeCategory10);

const parseData = (data: DataPoint[], metrics: string[], accessor: string): ParsedDataPoint[] => {
  const parseDate = d3.timeParse("%Y-%m-%d");
  return data.map((d) => ({
    date: parseDate(d.date) as Date,
    metrics: metrics.reduce((acc, metric) => {
    // @ts-ignore
      acc[metric] = d[accessor][metric];
      return acc;
    }, {} as { [key: string]: number }),
  }));
};

const createScales = (
  parsedData: ParsedDataPoint[],
  metrics: string[],
  width: number,
  height: number
) => {
  const x = d3
    .scaleTime()
    .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(parsedData, (d) =>
        d3.max(metrics, (metric) => d.metrics[metric])
      ) as number,
    ])
    .range([height, 0]);

  return { x, y };
};

const drawAxes = (g: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number>, y: d3.ScaleLinear<number, number>, height: number) => {
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    // @ts-ignore
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d") as (n: Date) => string));

  g.append("g").call(d3.axisLeft(y));
};

const drawLines = (g: d3.Selection<SVGGElement, unknown, null, undefined>, parsedData: ParsedDataPoint[], x: d3.ScaleTime<number, number>, y: d3.ScaleLinear<number, number>, metrics: string[], activeMetrics: Set<string>) => {
  const line = d3
    .line<ParsedDataPoint>()
    .x((d) => x(d.date))
    .curve(d3.curveMonotoneX);

  metrics.forEach((metric, i) => {
    const metricLine = line.y((d) => y(d.metrics[metric]));

    g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", colors(i.toString()))
      .attr("stroke-width", 1.5)
      .attr("d", metricLine)
      .attr("class", `line ${metric}`)
      .style("display", activeMetrics.has(metric) ? "block" : "none");
  });
};

const drawAverageLine = (g: d3.Selection<SVGGElement, unknown, null, undefined>, parsedData: ParsedDataPoint[], x: d3.ScaleTime<number, number>, y: d3.ScaleLinear<number, number>, activeMetrics: Set<string>) => {
  const averagedData = parsedData.map((d) => {
    const activeValues = Array.from(activeMetrics).map(
      (metric) => d.metrics[metric]
    );
    const average =
      activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length;
    return { date: d.date, average };
  });

  const avgLine = d3
    .line<{ date: Date; average: number }>()
    .x((d) => x(d.date))
    .y((d) => y(d.average))
    .curve(d3.curveMonotoneX);

  g.append("path")
    .datum(averagedData)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5")
    .attr("d", avgLine)
    .attr("class", "average-line");
};

const drawLegend = (
  svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  width: number,
  margin: { top: number; right: number; bottom: number; left: number },
  metrics: string[],
  activeMetrics: Set<string>,
  toggleMetric: (metric: string) => void
) => {
  const legend = svgElement
    .append("g")
    .attr("transform", `translate(${width + margin.left + 20},${margin.top})`);

  metrics.forEach((metric, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0,${i * 20})`)
      .style("cursor", "pointer")
      .on("click", () => toggleMetric(metric));

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colors(i.toString()))
      .attr("opacity", activeMetrics.has(metric) ? 1 : 0.3);

    legendRow
      .append("text")
      .attr("x", 15)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text(metric)
      .attr("fill", activeMetrics.has(metric) ? "black" : "grey");
  });
};

const toggleMetric = (
  metric: string,
  data: DataPoint[],
  config: Config,
  svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  activeMetrics: Set<string>
) => {
  if (activeMetrics.has(metric)) {
    activeMetrics.delete(metric);
  } else {
    activeMetrics.add(metric);
  }
  drawChart(data, config, svgElement, activeMetrics);
};

const drawChart = (
  data: DataPoint[],
  config: Config,
  svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  activeMetrics: Set<string>
) => {
  if (!data.length) return;

  const width = config.width - config.margin.left - config.margin.right;
  const height = config.height - config.margin.top - config.margin.bottom;

  const parsedData = parseData(data, config.metrics, config.accessor);
  const { x, y } = createScales(parsedData, config.metrics, width, height);

  svgElement.selectAll("*").remove();

  const g = svgElement
    .append("g")
    .attr("transform", `translate(${config.margin.left},${config.margin.top})`);

  drawAxes(g, x, y, height);
  drawLines(g, parsedData, x, y, config.metrics, activeMetrics);
  drawAverageLine(g, parsedData, x, y, activeMetrics);
  drawLegend(
    svgElement,
    width,
    config.margin,
    config.metrics,
    activeMetrics,
    (metric) => toggleMetric(metric, data, config, svgElement, activeMetrics)
  );
};

export function initializeChart(
  container: HTMLElement,
  data: DataPoint[],
  config: Config
) {
  const svgElement = d3.select(container).append<SVGSVGElement>("svg")
    .attr("width", config.width + config.margin.left + config.margin.right + 100)
    .attr("height", config.height + config.margin.top + config.margin.bottom);
  
  const activeMetrics = new Set(config.metrics);
  drawChart(data, config, svgElement, activeMetrics);
}
