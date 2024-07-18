import * as d3 from "d3";

export interface XYConfig {
  variant: string;
  nKey: string;
  xKey: string;
  yKey: string;
  dKey: string;
  ticks: number;
  lineWidth: number;
  pointWidth: number;
  show: string[];
  defaultFeatures: string[];
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
  enableZoom: boolean;
  colors: string[];
}

interface DataEntry {
  [key: string]: any;
}

interface Series {
  [key: string]: any;
  dKey: DataEntry[];
}

interface GraphParamsBase {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Series[];
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  nKey: string;
  xKey: string;
  yKey: string;
  dKey: string;
  newScales?: {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
  };
}

interface GridAndAxesParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  ticks: number;
}

interface AddLegendParams {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  data: Series[];
  width: number;
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  toggleSeries: (nKey: string) => void;
  nKey: string;
}

interface UseScalesParams {
  data: Series[];
  width: number;
  height: number;
  xKey: string;
  yKey: string;
  dKey: string;
}

interface UseColorsParams {
  colors: string[];
  series: string[];
}

interface InitializeShowParams {
  defaultFeatures: string[];
}

interface InitializeXYElementsParams extends GraphParamsBase {
  graphGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  show: { [key: string]: boolean };
  width: number;
  height: number;
  lineWidth: number;
  pointWidth: number;
  ticks: number;
}

interface UseZoomParams {
  svgElement: SVGSVGElement;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  show: { [key: string]: boolean };
  data: Series[];
  color: d3.ScaleOrdinal<string, unknown>;
  selectedSeries: Set<string>;
  ticks: number;
  lineWidth: number;
  pointWidth: number;
  nKey: string;
  xKey: string;
  yKey: string;
  dKey: string;
}

export function parseDate(dateStr: string): Date | null {
  return d3.isoParse(dateStr);
}

export function createSvg(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number }
): d3.Selection<SVGGElement, unknown, null, undefined> {
  const svg = d3
    .select(svgElement)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append<SVGGElement>("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  return svg;
}

export function addGridLines({ svg, x, y, width, height, ticks }: GridAndAxesParams): void {
  const xAxis = d3.axisBottom(x).ticks(ticks).tickSize(-height).tickFormat(null);
  const yAxis = d3.axisLeft(y).ticks(ticks).tickSize(-width).tickFormat(null);

  svg
    .append("g")
    .attr("class", "grid x-grid")
    .attr("color", "lightgray")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis as any);

  svg
    .append("g")
    .attr("class", "grid y-grid")
    .attr("color", "lightgray")
    .call(yAxis as any);
}

export function addAxes({ svg, x, y, height, ticks }: GridAndAxesParams): void {
  const xAxis = d3.axisBottom(x)
    .ticks(ticks)
    .tickFormat((d) => d3.timeFormat("%d/%m/%Y")(d as Date)); // Ensure TypeScript knows 'd' is a Date

  const yAxis = d3.axisLeft(y);

  const xAxisGroup = svg
    .append<SVGGElement>("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis as any); // Use 'any' to bypass the strict type check

  const yAxisGroup = svg
    .append<SVGGElement>("g")
    .attr("class", "axis y-axis")
    .call(yAxis as any); // Use 'any' to bypass the strict type check

  xAxisGroup.selectAll("path").attr("stroke", "#4083b9");
  xAxisGroup.selectAll("line").attr("stroke", "#4083b9");
  yAxisGroup.selectAll("path").attr("stroke", "#4083b9");
  yAxisGroup.selectAll("line").attr("stroke", "#4083b9");

  xAxisGroup.selectAll("text").attr("fill", "#000000");
  yAxisGroup.selectAll("text").attr("fill", "#000000");
}

export function addLines(params: GraphParamsBase & { lineWidth: number }): void {
  const { svg, data, x, y, color, selectedSeries, lineWidth, nKey, xKey, yKey, dKey, newScales } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const line = d3
        .line<DataEntry>()
        .x((d: DataEntry) => xScale(parseDate(d[xKey])!))
        .y((d: DataEntry) => yScale(d[yKey]));

      const path = svg.select(`.line.series-${index}`);
      if (path.empty()) {
        svg
          .append("path")
          .datum(series[dKey])
          .attr("class", `line series-${index}`)
          .attr("fill", "none")
          .attr("stroke", color(`${index}`) as string)
          .attr("stroke-width", lineWidth || 1.5)
          .attr("d", line(series[dKey])); // Call the line generator with the data
      } else {
        path.attr("d", line(series[dKey])); // Call the line generator with the data
      }
    }
  });
}

export function addAreas(params: GraphParamsBase): void {
  const { svg, data, x, y, color, selectedSeries, nKey, xKey, yKey, dKey, newScales } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const area = d3
        .area<DataEntry>()
        .x((d: DataEntry) => xScale(parseDate(d[xKey])!))
        .y0(yScale(0))
        .y1((d: DataEntry) => yScale(d[yKey]));

      const path = svg.select(`.area.series-${index}`);
      if (path.empty()) {
        svg
          .append("path")
          .datum(series[dKey])
          .attr("class", `area series-${index}`)
          .attr("fill", color(`${index}`) as string)
          .attr("opacity", 0.3)
          .attr("d", area(series[dKey])); // Call the area generator with the data
      } else {
        path.attr("d", area(series[dKey])); // Call the area generator with the data
      }
    }
  });
}

export function addPoints(params: GraphParamsBase & { pointRadius: number }): void {
  const { svg, data, x, y, color, selectedSeries, pointRadius, nKey, xKey, yKey, dKey, newScales } = params;
  const xScale = newScales?.x ?? x;
  const yScale = newScales?.y ?? y;

  data.forEach((series, index) => {
    if (selectedSeries.has(series[nKey])) {
      const points = svg.selectAll(`circle.series-${index}`).data(series[dKey]);

      points.enter()
        .append("circle")
        .attr("class", `point series-${index}`)
        .attr("cx", (d: any) => xScale(parseDate(d[xKey])!))
        .attr("cy", (d: any) => yScale(d[yKey]))
        .attr("r", pointRadius || 2)
        .attr("fill", color(`${index}`) as string);

      points
        .attr("cx", (d: any) => xScale(parseDate(d[xKey])!))
        .attr("cy", (d: any) => yScale(d[yKey]));
    }
  });
}

export function addLegend(params: AddLegendParams): void {
  const { svg, data, width, color, selectedSeries, toggleSeries, nKey } = params;
  const legend = svg
    .append("g")
    .attr("transform", "translate(0, 0)");

  data.forEach((series, index) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${index * 25})`); // Adjusted spacing for uniform size

    legendRow
      .append("rect")
      .attr("width", 16) // Standardized size
      .attr("height", 16) // Standardized size
      .attr(
        "fill",
        selectedSeries.has(series[nKey]) ? color(`${index}`) as string : "white"
      )
      .style("stroke", color(`${index}`) as string)
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", () => {
        toggleSeries(series[nKey]);
      });

    legendRow
      .append("text")
      .attr("x", 22) // Standardized spacing
      .attr("y", 12) // Adjusted for alignment
      .style("font-size", "14px") // Standardized font size
      .attr("text-anchor", "start")
      .style("text-transform", "capitalize")
      .text(series[nKey]);
  });
}

export function initializeShow({ defaultFeatures }: InitializeShowParams): { [key: string]: boolean } {
  const features = ['grid', 'axis', 'areas', 'lines', 'points', 'heat'];
  const show: { [key: string]: boolean } = {};

  features.forEach(feature => {
    show[feature] = defaultFeatures.includes(feature);
  });

  return show;
}

export function useScales(params: UseScalesParams): { x: d3.ScaleTime<number, number>; y: d3.ScaleLinear<number, number> } {
  const { data, width, height, xKey, yKey, dKey } = params;
  console.log('useScales params:', params);

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Data is not valid');
  }

  const allValues = data.flatMap(series => series[dKey]);

  if (!allValues || allValues.length === 0) {
    throw new Error('Data entries are not valid');
  }

  const x = d3
    .scaleTime()
    .domain(d3.extent(allValues, (d: any) => parseDate(d[xKey])!) as [Date, Date])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(allValues, (d: any) => d[yKey])!])
    .range([height, 0]);

  return { x, y };
}

export function useColors(params: UseColorsParams): { color: d3.ScaleOrdinal<string, unknown> } {
  const { colors, series } = params;
  const color = d3.scaleOrdinal<string, unknown>(colors);
  color.domain(series); // Ensure the color scale has the correct domain
  return { color };
}

export function useZoom(params: UseZoomParams): void {
  const { svgElement, x, y, width, height, show, data, color, selectedSeries, ticks, lineWidth, pointWidth, nKey, xKey, yKey, dKey } = params;

  const zoom: d3.ZoomBehavior<SVGSVGElement, unknown> = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8])
    .extent([[0, 0], [width, height]])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  d3.select<SVGSVGElement, unknown>(svgElement).call(zoom);

  function zoomed(event: any): void {
    const transform = event.transform;
    const newX = transform.rescaleX(x);
    const newY = transform.rescaleY(y);

    constrainDomain(newX, x);
    constrainDomain(newY, y);

    if (show['grid']) updateGrid(newX, newY);
    if (show['axis']) updateAxes(newX, newY);
    const newScales = { x: newX, y: newY };
    updateGraphElements(newScales);
  }

  function constrainDomain(newScale: any, originalScale: any): void {
    const [newMin, newMax] = newScale.domain();
    const [originalMin, originalMax] = originalScale.domain();

    if (newMin < originalMin) {
      newScale.domain([originalMin, newMax - (newMin - originalMin)]);
    }
    if (newMax > originalMax) {
      newScale.domain([newMin - (newMax - originalMax), originalMax]);
    }
  }

  function updateGrid(newX: any, newY: any): void {
    d3.select(svgElement).select(".x-grid")
      .call(d3.axisBottom(newX).ticks(ticks).tickSize(-height).tickFormat(null) as any);
    d3.select(svgElement).select(".y-grid")
      .call(d3.axisLeft(newY).ticks(ticks).tickSize(-width).tickFormat(null) as any);
  }

  function updateAxes(newX: any, newY: any): void {
    d3.select(svgElement).select(".x-axis")
      .call(d3.axisBottom(newX).ticks(ticks).tickFormat((d) => d3.timeFormat("%d/%m/%Y")(d as Date)) as any); // Ensure TypeScript knows 'd' is a Date
    d3.select(svgElement).select(".y-axis")
      .call(d3.axisLeft(newY).ticks(ticks) as any); // Use 'any' to bypass the strict type check
  }

  function updateGraphElements(newScales: { x: d3.ScaleTime<number, number>; y: d3.ScaleLinear<number, number> }): void {
    const graphGroup = d3.select(svgElement).select<SVGGElement>("g");

    if (show['areas']) addAreas({ svg: graphGroup, data, x, y, color, selectedSeries, nKey, xKey, yKey, dKey, newScales });
    if (show['lines']) addLines({ svg: graphGroup, data, x, y, color, selectedSeries, lineWidth, nKey, xKey, yKey, dKey, newScales });
    if (show['points']) addPoints({ svg: graphGroup, data, x, y, color, selectedSeries, pointRadius: pointWidth, nKey, xKey, yKey, dKey, newScales });
  }
}

export function initializeXYElements(params: InitializeXYElementsParams): void {
  const { svg, graphGroup, data, x, y, color, selectedSeries, show, width, height, lineWidth, pointWidth, nKey, xKey, yKey, dKey, ticks } = params;

  if (show['grid']) addGridLines({ svg, x, y, width, height, ticks });
  if (show['axis']) addAxes({ svg, x, y, height, ticks, width });
  if (show['areas']) addAreas({ svg: graphGroup, data, x, y, color, selectedSeries, nKey, xKey, yKey, dKey });
  if (show['lines']) addLines({ svg: graphGroup, data, x, y, color, selectedSeries, lineWidth, nKey, xKey, yKey, dKey });
  if (show['points']) addPoints({ svg: graphGroup, data, x, y, color, selectedSeries, pointRadius: pointWidth, nKey, xKey, yKey, dKey });
}

// New functions for toggles
export function addToggles(svg: d3.Selection<SVGGElement, unknown, null, undefined>, show: { [key: string]: boolean }, toggleShow: (option: string) => void): void {
  const toggleContainer = svg.append("g").attr("class", "toggles").attr("transform", "translate(0, 0)");
  
  Object.keys(show).forEach((option, index) => {
    const toggleItem = toggleContainer.append("g").attr("class", "toggle-item").attr("transform", `translate(0, ${index * 25})`); // Adjusted spacing for uniform size
    
    toggleItem.append("rect")
      .attr("width", 16) // Standardized size
      .attr("height", 16) // Standardized size
      .attr("fill", show[option] ? "#7597c9" : "white")
      .attr("stroke", "#7597c9")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", () => {
        toggleShow(option);
      });

    toggleItem.append("text")
      .attr("x", 22) // Standardized spacing
      .attr("y", 12) // Adjusted for alignment
      .style("font-size", "14px") // Standardized font size
      .style("fill", "#333")
      .text(option)
      .style("cursor", "pointer")
      .on("click", () => {
        toggleShow(option);
      });
  });
}
