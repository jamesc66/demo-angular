import * as d3 from "d3";



export interface DrawHeatPointParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  config: RadarConfig;
  color: (key: string) => string;
  selectedSeries: Set<string>;
}

export interface InitializeSVGParams {
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  element: HTMLElement; // Add this line


}

export interface CalculateAngleSliceParams {
  data: Map<any, Record<string, any>[]>;
}

export interface InitializeScaleParams {
  radius: number;
}

export interface DrawGridParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  radius: number;
}

export interface DrawAxisParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  config: RadarConfig;
}

export interface DrawRadarAreasParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  initialLoad: boolean;
  seriesColorMap: Map<string, string>;
  config: RadarConfig;
}

export interface DrawRadarLinesParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  initialLoad: boolean;
  seriesColorMap: Map<string, string>;
  config: RadarConfig;
}

export interface DrawRadarPointsParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  initialLoad: boolean;
  seriesColorMap: Map<string, string>;
  show: { [key: string]: boolean };
  config: RadarConfig;
}

export interface ShadeSegmentParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  shadedSegment: {
    startAxis: number;
    endAxis: number;
    color: string;
    opacity: number;
  };
}

export interface ShadeSegmentsParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  shadedSegments: {
    startAxis: number;
    endAxis: number;
    color: string;
    opacity: number;
  }[];
  config: RadarConfig;
}

export interface AddTogglesParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  show: { [key: string]: boolean };
  toggleShow: (option: string) => void;
}

export interface ToggleItemParams {
  toggleContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
  option: string;
  index: number;
  show: { [key: string]: boolean };
  toggleShow: (option: string) => void;
}

export interface AddLegendParams {
  svg: d3.Selection<SVGGElement, unknown, null,  undefined>;
  data: Record<string, any>[];
  width: number;
  color: (key: string) => string;
  selectedSeries: Set<string>;
  toggleSeries: (key: string) => void;
  nKey: string;
}

export interface LegendItemParams {
  legend: d3.Selection<SVGGElement, unknown, null, undefined>;
  series: Record<string, any>;
  index: number;
  color: (key: string) => string;
  selectedSeries: Set<string>;
  toggleSeries: (key: string) => void;
  nKey: string;
}

export interface AddAnnotationsParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  radius: number;
}

export interface InitializeShowParams {
  config: RadarConfig;
}

export interface InitializeRadarElementsParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  filteredData: Map<any, Record<string, any>[]>;
  rScale: d3.ScaleLinear<number, number>;
  angleSlice: number;
  initialLoad: boolean;
  seriesColorMap: Map<string, string>;
  config: RadarConfig;
  show: { [key: string]: boolean };
  allData: Map<any, Record<string, any>[]>;
  shadedSegments: {
    startAxis: number;
    endAxis: number;
    color: string;
    opacity: number;
  }[];
  radius: number;
}




export interface RadarConfig {
  variant: string;
  nKey: string;
  xKey: string;
  yKey: string;
  dataKey: string;
  timeKey: string;
  seriesKey: string;
  show: string[];
  toggle: boolean;
  defaultFeatures: string[];
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
  colors: string[];
  shadedSegments: {
    startAxis: number;
    endAxis: number;
    color: string;
    opacity: number;
  }[];
}

export interface InitializeSeriesColorsParams {
  data: Record<string, any>[];
  seriesKey: string;
  seriesColorMap: Map<string, string>;
  customColorScale: string[];
}


export function initializeSeriesColors({
  data,
  seriesKey,
  seriesColorMap,
  customColorScale,
}: InitializeSeriesColorsParams): void {
  let seriesKeys = new Set(data.map((d: any) => d[seriesKey]));
  let colorScale = d3.scaleOrdinal(customColorScale).domain(Array.from(seriesKeys));
  seriesKeys.forEach((key) => {
    seriesColorMap.set(key, colorScale(key));
  });
}

export function drawHeatPoint({
  svg,
  data,
  rScale,
  angleSlice,
  config,
  color,
  selectedSeries,
}: DrawHeatPointParams): void {
  data.forEach((values: any, key: any) => {
    const newValues = values[config.dataKey].filter((d: any) =>
      selectedSeries.has(d[config.seriesKey])
    );
    const keyPercentage = (key / data.size) * 100;
    const opacityRange = [0.1, 0.3];
    const radiusRange = [20, 3];
    const radius = radiusRange[0] + ((radiusRange[1] - radiusRange[0]) * keyPercentage) / 100;
    const opacity = opacityRange[0] + ((opacityRange[1] - opacityRange[0]) * keyPercentage) / 100;

    svg
      .append("g")
      .selectAll(".dot")
      .data(newValues)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
      )
      .attr(
        "cy",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
      )
      .attr("r", radius)
      .style("fill", (d: any) => color(d.room))
      .style("fill-opacity", opacity);
  });
}

export function initializeSVG({
  margin,
  width,
  height,
  
}: InitializeSVGParams): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
  d3.select<HTMLElement, any>("#radarChart").selectAll("*").remove();
  return d3
    .select<HTMLElement, any>("#radarChart")
    .append<SVGSVGElement>("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append<SVGGElement>("g")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    );
}

export function calculateAngleSlice({
  data,
}: {
  data: Map<string, Record<string, any>[]>;
}): number {
  return (Math.PI * 2) / Array.from(data.values())[0].length;
}

export function initializeScale({
  radius,
}: {
  radius: number;
}): d3.ScaleLinear<number, number> {
  return d3.scaleLinear().range([0, radius]).domain([0, 10]);
}


export function drawGrid({
  svg,
  radius,
}: DrawGridParams): void {
  const axisGrid = svg.append("g").attr("class", "axisWrapper");

  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, 11).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d: any) => (radius / 10) * d)
    .style("fill", "none")
    .style("stroke", "#CDCDCD")
    .style("stroke-width", 1)
    .style("stroke-opacity", 0.75);
}

export function drawAxis({
  svg,
  data,
  rScale,
  angleSlice,
  config,
}: DrawAxisParams): void {
  svg
    .selectAll(".axis")
    .data(Array.from(data.values())[0])
    .enter()
    .append("g")
    .attr("class", "axis")
    .each(function (d: any, i: number) {
      const x2 = rScale(10) * Math.cos(angleSlice * i - Math.PI / 2);
      const y2 = rScale(10) * Math.sin(angleSlice * i - Math.PI / 2);

      d3.select(this)
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", "lightgrey")
        .style("stroke-width", "1px");

      const labelOffset = 20;

      d3.select(this)
        .append("text")
        .attr(
          "x",
          (rScale(10) + labelOffset) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y",
          (rScale(10) + labelOffset) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .text(d[config.xKey]);

      d3.select(this)
        .append("circle")
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("r", 2)
        .style("fill", "lightgrey");
    });
}

export function drawRadarAreas({
  svg,
  data,
  rScale,
  angleSlice,
  initialLoad,
  seriesColorMap,
  config,
}: DrawRadarAreasParams): void {
  const radarArea = d3
    .areaRadial()
    .angle((d: any, i: number) => i * angleSlice)
    .innerRadius(0)
    .outerRadius((d: any) => rScale(d[config.yKey]))
    .curve(d3.curveLinearClosed);

  data.forEach((values: any, key: any) => {
    const path = svg
      .append("path")
      .datum(values)
      .attr("d", radarArea)
      .style("fill", seriesColorMap.get(key) as string)
      .style("fill-opacity", 0.1);

    if (initialLoad) {
      path
        .attr("d", radarArea.innerRadius(0).outerRadius(0))
        .transition()
        .duration(1000)
        .attr("d", radarArea);
    } else {
      path.transition().duration(1000).attr("d", radarArea);
    }
  });
}

export function drawRadarLines({
  svg,
  data,
  rScale,
  angleSlice,
  initialLoad,
  seriesColorMap,
  config,
}: DrawRadarLinesParams): void {
  const radarLine = d3
    .lineRadial()
    .radius((d: any) => rScale(d[config.yKey]))
    .angle((d: any, i: number) => i * angleSlice)
    .curve(d3.curveLinearClosed);

  data.forEach((values: any, key: any) => {
    const path = svg
      .append("path")
      .datum(values)
      .attr("d", radarLine)
      .style("fill", "none")
      .style("stroke", seriesColorMap.get(key) as string)
      .style("stroke-width", 1);

    if (initialLoad) {
      path
        .attr("d", radarLine.radius(() => 0))
        .transition()
        .duration(1000)
        .attr("d", radarLine);
    } else {
      path.transition().duration(1000).attr("d", radarLine);
    }
  });
}

export function drawRadarPoints({
  svg,
  data,
  rScale,
  angleSlice,
  initialLoad,
  seriesColorMap,
  show,
  config,
}: DrawRadarPointsParams): void {
  data.forEach((values: any, key: any) => {
    const points = svg.append("g").selectAll(".dot").data(values).enter();

    points
      .append("circle")
      .attr(
        "cx",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
      )
      .attr(
        "cy",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
      )
      .attr("r", 3)
      .style("fill", seriesColorMap.get(key) as string)
      .style("stroke", "none");

    points
      .append("circle")
      .attr(
        "cx",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
      )
      .attr(
        "cy",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
      )
      .attr("r", 2)
      .style("fill", "#fff")
      .style("stroke", seriesColorMap.get(key) as string)
      .style("stroke-width", 1)
      .on("mouseover", function (event: any, d: any) {
        if (show['tooltip']) {
          d3.select(".tooltip")
            .style("opacity", 0.9)
            .html(`Insight: ${d[config.xKey]}<br>Value: ${d[config.yKey]}`);
        }
      })
      .on("mousemove", function (event: any) {
        if (show['tooltip']) {
          d3.select(".tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        }
      })
      .on("mouseout", function () {
        if (show['tooltip']) {
          d3.select(".tooltip").style("opacity", 0);
        }
      });

    svg
      .append("g")
      .selectAll(".hover-area")
      .data(values)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.cos(angleSlice * j - Math.PI / 2)
      )
      .attr(
        "cy",
        (d: any, j: any) =>
          rScale(d[config.yKey]) * Math.sin(angleSlice * j - Math.PI / 2)
      )
      .attr("r", 10)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (event: any, d: any) {
        if (show['tooltip']) {
          d3.select(".tooltip")
            .style("opacity", 0.9)
            .html(`Insight: ${d[config.xKey]}<br>Value: ${d[config.yKey]}`);
        }
      })
      .on("mousemove", function (event: any) {
        if (show['tooltip']) {
          d3.select(".tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        }
      })
      .on("mouseout", function () {
        if (show['tooltip']) {
          d3.select(".tooltip").style("opacity", 0);
        }
      });
  });
}

export function shadeSegment({
  svg,
  rScale,
  angleSlice,
  shadedSegment,
}: ShadeSegmentParams): void {
  if (!shadedSegment) {
    console.error("shadedSegment is undefined");
    return;
  }

  const { startAxis, endAxis, color, opacity } = shadedSegment;

  const startAngle = angleSlice * startAxis - Math.PI / 2;
  const endAngle = angleSlice * endAxis - Math.PI / 2;

  const segmentData: [number, number][] = [
    [startAngle, 0],
    [startAngle, rScale(10)],
    [endAngle, rScale(10)],
    [endAngle, 0],
  ];

  const segmentPath = d3
    .lineRadial<[number, number]>()
    .angle((d: [number, number]) => d[0])
    .radius((d: [number, number]) => d[1])
    .curve(d3.curveLinearClosed);

  svg
    .append("path")
    .datum(segmentData)
    .attr("d", segmentPath)
    .style("fill", color)
    .style("fill-opacity", opacity);
}

export function shadeSegments({
  svg,
  rScale,
  angleSlice,
  shadedSegments,
  config,
}: ShadeSegmentsParams): void {
  if (!Array.isArray(shadedSegments)) {
    console.error("shadedSegments is not an array");
    return;
  }

  shadedSegments.forEach((segment: any) =>
    shadeSegment({ svg, rScale, angleSlice, shadedSegment: segment })
  );
}

export function addTooltip(): void {
  d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

export function addToggles({
  svg,
  show,
  toggleShow,
}: AddTogglesParams): void {
  const toggleContainer = svg
    .append("g")
    .attr("class", "toggles")
    .attr("transform", "translate(0, 0)");

  Object.keys(show).forEach((option, index) => {
    toggleItem({ toggleContainer, option, index, show, toggleShow });
  });
}

export function toggleItem({
  toggleContainer,
  option,
  index,
  show,
  toggleShow,
}: ToggleItemParams): void {
  const toggleItem = toggleContainer
    .append("g")
    .attr("class", "toggle-item")
    .attr("transform", `translate(0, ${index * 25})`)
    .style("cursor", "pointer")
    .on("click", () => {
      toggleShow(option);
    });

  toggleItem
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", 3)
    .attr("y", 2)
    .attr("fill", show[option] ? "#7597c9" : "white")
    .attr("stroke", "#7597c9")
    .attr("stroke-width", 2);

  toggleItem
    .append("text")
    .attr("x", 22)
    .attr("y", 12)
    .style("font-size", "14px")
    .attr("text-anchor", "start")
    .style("text-transform", "capitalize")
    .text(option);
}

export function initializeControls({
  legendContainer,
  series,
  show,
}: {
  legendContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
  series: Record<string, any>[];
  show: { [key: string]: boolean };

}): any {
  const legendBase = legendContainer
  .append("svg")
  .attr("width", 200)
  .attr("height", series.length * 25 + Object.keys(show).length * 25);

const legend = legendBase.append("g").attr("class", "legend");

const toggles = legend
  .append("g")
  .attr("class", "toggles")
  .attr("transform", `translate(0, ${series.length * 25})`);
  return {
    legend,
    toggles,
  };
}

export function addLegend({
  svg,
  data,
  width,
  color,
  selectedSeries,
  toggleSeries,
  nKey,
}: AddLegendParams): void {
  const legend = svg.append("g").attr("transform", "translate(0, 0)");

  data.forEach((series: any, index: number) => {
    legendItem({ legend, series, index, color, selectedSeries, toggleSeries, nKey });
  });
}

export function legendItem({
  legend,
  series,
  index,
  color,
  selectedSeries,
  toggleSeries,
  nKey,
}: LegendItemParams): void {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${index * 25})`)
    .style("cursor", "pointer")
    .on("click", () => {
      toggleSeries(series[nKey]);
    });

  legendRow
    .append("circle")
    .attr("cx", 8)
    .attr("cy", 8)
    .attr("r", 5)
    .attr(
      "fill",
      selectedSeries.has(series[nKey]) ? color(series[nKey]) : "white"
    )
    .style("stroke", color(series[nKey]))
    .style("stroke-width", 2);

  legendRow
    .append("text")
    .attr("x", 22)
    .attr("y", 12)
    .style("font-size", "14px")
    .attr("text-anchor", "start")
    .style("text-transform", "capitalize")
    .text(series[nKey]);
}

export function addAnnotations({
  svg,
  radius,
}: AddAnnotationsParams): void {
  svg
    .append("line")
    .attr("x1", -radius)
    .attr("y1", 0)
    .attr("x2", radius)
    .attr("y2", 0)
    .style("stroke", "#7597C9")
    .style("stroke-width", 1);

  svg
    .append("foreignObject")
    .attr("x", -radius - 30)
    .attr("y", -40)
    .attr("width", 19)
    .attr("height", 18)
    .append("xhtml:div")
    .html(
      '<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.86778 11.0601H7.12411V17.3186H2.42579V9.5H0.59668L9.09668 1" stroke="#7597C9" stroke-width="0.5"/><path d="M8.32558 11.0601H11.0693V17.3186H15.7676V9.5H17.5967L9.09668 1" stroke="#7597C9" stroke-width="0.5"/></svg>'
    );

  svg
    .append("rect")
    .attr("x", -radius - 60)
    .attr("y", -18)
    .attr("width", 50)
    .attr("height", 20)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", "none")
    .style("stroke", "#7597C9")
    .style("stroke-width", 1);

  svg
    .append("text")
    .attr("x", -radius - 35)
    .attr("y", -10)
    .attr("dy", "0.35em")
    .style("font-size", "10px")
    .attr("text-anchor", "middle")
    .style("fill", "#7597C9")
    .text("Structural");

  svg
    .append("foreignObject")
    .attr("x", -radius - 35)
    .attr("y", 20)
    .attr("width", 24)
    .attr("height", 15)
    .append("xhtml:div")
    .html(
      '<svg width="24" height="11" viewBox="0 0 24 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.1169" cy="3.27701" r="2.48649" stroke="#7597C9" stroke-width="0.5"/><circle cx="5.63028" cy="2.73649" r="2.48649" stroke-width="0.5"/><circle cx="2.73649" cy="2.73649" r="2.48649" stroke-width="0.5"/><path d="M7.08325 10C7.36478 8.67118 8.75217 6.01352 12.0495 6.01352C15.3468 6.01352 16.8693 8.67118 17.2184 10" stroke="#7597C9" stroke-width="0.5"/><path d="M0.59668 9.45945C0.878211 8.13062 2.2656 5.47296 5.5629 5.47296C6.63242 5.47296 7.51522 5.75258 8.23181 6.17577" stroke="#7597C9" stroke-width="0.5"/><path d="M23.6372 9.45945C23.3557 8.13062 21.9683 5.47296 18.671 5.47296C17.6015 5.47296 16.7187 5.75258 16.0021 6.17577" stroke="#7597C9" stroke-width="0.5"/></svg>'
    );

  svg
    .append("rect")
    .attr("x", -radius - 82)
    .attr("y", 5)
    .attr("width", 75)
    .attr("height", 20)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", "none")
    .style("stroke", "#7597C9")
    .style("stroke-width", 1);

  svg
    .append("text")
    .attr("x", -radius - 10)
    .attr("y", 13)
    .attr("dy", "0.35em")
    .style("font-size", "10px")
    .attr("text-anchor", "end")
    .style("fill", "#7597C9")
    .text("Environmental");

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow-up")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .append("path")
    .attr("d", "M 1 3 L 5 8 L 9 3")
    .attr("orient", "90")
    .style("fill", "none")
    .style("stroke", "#7597C9")
    .style("stroke-width", 1.5);

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow-down")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .append("path")
    .attr("d", "M 1 7 L 5 2 L 9 7")
    .style("fill", "none")
    .style("stroke", "#7597C9")
    .style("stroke-width", 1.5);

  const lineHeight = 4 * 16;
  const lineY1 = -lineHeight / 2;
  const lineY2 = lineHeight / 2;

  svg
    .append("line")
    .attr("x1", -radius)
    .attr("y1", lineY1)
    .attr("x2", -radius)
    .attr("y2", lineY2)
    .style("stroke", "#7597C9")
    .style("stroke-width", 1)
    .attr("marker-start", "url(#arrow-down)")
    .attr("marker-end", "url(#arrow-up)");
}

export function initializeShow({
  config,
}: {
  config: RadarConfig;
}): { [key: string]: boolean } {
  const defaultFeatures = config.defaultFeatures || [];
  const features = [
    'grid',
    'axis',
    'areas',
    'lines',
    'points',
    'heat',
    'shadedSegments',
    'annotations',
  ];

  const show: { [key: string]: boolean } = {};

  features.forEach((feature) => {
    show[feature] = defaultFeatures.length
      ? defaultFeatures.includes(feature)
      : config.show.includes(feature);
  });

  return show;
}

export function initializeRadarElements({
  svg,
  filteredData,
  rScale,
  angleSlice,
  initialLoad,
  seriesColorMap,
  config,
  show,
  allData,
  radius,
}: any): void {
  if (show['areas']) {
    drawRadarAreas({
      svg,
      data: filteredData,
      rScale,
      angleSlice,
      initialLoad,
      seriesColorMap,
      config,
    });
  }
  if (show['lines']) {
    drawRadarLines({
      svg,
      data: filteredData,
      rScale,
      angleSlice,
      initialLoad,
      seriesColorMap,
      config,
    });
  }
  if (show['shadedSegments']) {
    shadeSegments({
      svg,
      rScale,
      angleSlice,
      shadedSegments: config.shadedSegments,
      config,
    });
  }
  if (show['grid']) {
    drawGrid({ svg, radius });
  }
  if (show['axis']) {
    drawAxis({
      svg,
      data: filteredData,
      rScale,
      angleSlice,
      config,
    });
  }
  if (show['tooltip']) {
    addTooltip();
  }
  if (show['heat']) {
    drawHeatPoint({
      svg,
      data: allData,
      rScale,
      angleSlice,
      config,
      color: (key: string) => seriesColorMap.get(key) as string,
      selectedSeries: new Set(Array.from(seriesColorMap.keys())),
    });
  }
  if (show['points']) {
    drawRadarPoints({
      svg,
      data: filteredData,
      rScale,
      angleSlice,
      initialLoad,
      seriesColorMap,
      show,
      config,
    });
  }
  if (show['annotations']) {
    addAnnotations({ svg, radius });
  }
}