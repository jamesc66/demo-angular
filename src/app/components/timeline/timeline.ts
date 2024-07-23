import * as d3 from "d3";

export interface TimelineData {
  date: string;
  insight: Insight[];
}

export interface Insight {
  room: string;
  insight: string;
  value: number;
}

export type SelectDateFunction = (type: string, detail?: any) => void;

export interface InitD3TimelineParams {
  timeline: HTMLDivElement | null;
  data: TimelineData[];
  handleRadius: number;
  sliderWidth: number;
  isPlaying: boolean;
  togglePlay: () => void;
  rewind: () => void;
  selectDate: SelectDateFunction;
  speed: number;
  handleDrag: (event: any) => void;
  handleDragEnd: () => void;
}

export interface CreatePlayPauseButtonParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  isPlaying: boolean;
  togglePlay: () => void;
}

export interface CreateSliderParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  handleRadius: number;
  sliderWidth: number;
  handleDrag: (event: any) => void;
  handleDragEnd: () => void;
  data: TimelineData[];
}

export interface CreateRewindButtonParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  rewind: () => void;
}

export interface CreateNumOfDaysTextParams {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  numOfDays: number;
}

export interface UpdatePlayPauseButtonParams {
  timeline: HTMLElement;
  isPlaying: boolean;
}

export interface UpdateNumOfDaysTextParams {
  timeline: HTMLElement;
  numOfDays: number;
}

export interface UpdateSliderWidthParams {
  timeline: HTMLElement;
  handleRadius: number;
  setSliderWidth: (width: number) => void;
}

export interface StartAutoSlideParams {
  data: TimelineData[];
  positionSetter: (value: number) => void;
  positionGetter: () => number;
  sliderWidth: number;
  speed: number;
  selectDate: SelectDateFunction;
  setPlayingState: (playing: boolean) => void;
  animationFrameRef: { current: number };
}

export interface RewindParams {
  positionSetter: (value: number) => void;
  data: TimelineData[];
  selectDate: SelectDateFunction;
}

export function calculateNumOfDays(data: TimelineData[]): number {
  try {
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    return Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  } catch (error) {
    console.error("Error calculating number of days:", error);
    return 0; // Fallback value
  }
}

export function createPlayPauseButton(
  params: CreatePlayPauseButtonParams
): void {
  const { container, isPlaying, togglePlay } = params;
  try {
    const playPauseButton = container
      .append<SVGSVGElement>("svg")
      .attr("width", 30)
      .attr("height", 40)
      .style("cursor", "pointer")
      .style("margin-right", "10px")
      .on("click", () => togglePlay());

    playPauseButton
      .append("rect")
      .attr("x", 8)
      .attr("y", 8)
      .attr("width", 6)
      .attr("height", 24)
      .attr("fill", "#7597C9")
      .attr("display", isPlaying ? "block" : "none");

    playPauseButton
      .append("rect")
      .attr("x", 16)
      .attr("y", 8)
      .attr("width", 6)
      .attr("height", 24)
      .attr("fill", "#7597C9")
      .attr("display", isPlaying ? "block" : "none");

    playPauseButton
      .append("polygon")
      .attr("points", "10,5 10,35 25,20")
      .attr("fill", "#7597C9")
      .attr("display", isPlaying ? "none" : "block");
  } catch (error) {
    console.error("Error creating play/pause button:", error);
  }
}
export function createSlider(params: CreateSliderParams): void {
  const {
    container,
    handleRadius,
    sliderWidth,
    handleDrag,
    handleDragEnd,
    data,
  } = params;

  try {
    const svg = container
      .append<SVGSVGElement>("svg")
      .attr("width", sliderWidth + handleRadius * 2)
      .attr("height", 40);

    svg
      .append("line")
      .attr("x1", handleRadius)
      .attr("y1", 20)
      .attr("x2", sliderWidth + handleRadius)
      .attr("y2", 20)
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2);

    const numOfDays = calculateNumOfDays(data);
    const daysArray = Array.from({ length: numOfDays + 1 }, (_, i) => i);

    for (const day of daysArray) {
      const xPos = (day / numOfDays) * sliderWidth + handleRadius;
      svg
        .append("line")
        .attr("x1", xPos)
        .attr("y1", 15)
        .attr("x2", xPos)
        .attr("y2", 25)
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1);
    }

    svg
      .append<SVGCircleElement>("circle")
      .attr("cx", handleRadius)
      .attr("cy", 20)
      .attr("r", handleRadius)
      .attr("fill", "white")
      .attr("stroke", "#7597C9")
      .attr("stroke-width", 2)
      .call(
        d3
          .drag<SVGCircleElement, unknown>()
          .on("drag", handleDrag)
          .on("end", handleDragEnd)
      );
  } catch (error) {
    console.error("Error creating slider:", error);
  }
}

export function createRewindButton(params: CreateRewindButtonParams): void {
  const { container, rewind } = params;
  try {
    const rewindButton = container
      .append<SVGSVGElement>("svg")
      .attr("width", 30)
      .attr("height", 40)
      .style("cursor", "pointer")
      .style("margin-left", "10px")
      .on("click", rewind);

    rewindButton
      .append("polygon")
      .attr("points", "20,5 20,35 5,20")
      .attr("fill", "#7597C9");
  } catch (error) {
    console.error("Error creating rewind button:", error);
  }
}

export function createNumOfDaysText(params: CreateNumOfDaysTextParams): void {
  const { container, numOfDays } = params;
  try {
    container
      .append<HTMLDivElement>("div")
      .attr("class", "num-of-days-text")
      .style("text-align", "center")
      .style("margin-top", "10px")
      .style("font-size", "0.8rem")
      .text(`Last ${numOfDays} days`);
  } catch (error) {
    console.error("Error creating number of days text:", error);
  }
}

export function initD3Timeline(params: InitD3TimelineParams): void {
  const {
    timeline,
    data,
    handleRadius,
    sliderWidth,
    isPlaying,
    togglePlay,
    rewind,
    selectDate,
    speed,
    handleDrag,
    handleDragEnd,
  } = params;

  if (!timeline) {
    console.error("Timeline element is null");
    return;
  }

  try {
    d3.select(timeline).selectAll("*").remove();
    const container = d3
      .select<HTMLDivElement, unknown>(timeline)
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center");

    const controlsContainer = container
      .append<HTMLDivElement>("div")
      .style("display", "flex")
      .style("align-items", "center");

    createPlayPauseButton({
      container: controlsContainer,
      isPlaying,
      togglePlay,
    });

    createSlider({
      container: controlsContainer,
      handleRadius,
      sliderWidth,
      handleDrag,
      handleDragEnd,
      data,
    });

    createRewindButton({ container: controlsContainer, rewind });
    createNumOfDaysText({ container, numOfDays: calculateNumOfDays(data) });
  } catch (error) {
    console.error("Error initializing D3 timeline:", error);
  }
}

export function updatePlayPauseButton(
  params: UpdatePlayPauseButtonParams
): void {
  const { timeline, isPlaying } = params;
  try {
    d3.select(timeline)
      .select("svg:nth-child(1)")
      .selectAll<SVGRectElement, unknown>("rect")
      .attr("display", isPlaying ? "block" : "none");

    d3.select(timeline)
      .select("svg:nth-child(1)")
      .selectAll<SVGPolygonElement, unknown>("polygon")
      .attr("display", isPlaying ? "none" : "block");
  } catch (error) {
    console.error("Error updating play/pause button:", error);
  }
}

export function updateNumOfDaysText(params: UpdateNumOfDaysTextParams): void {
  const { timeline, numOfDays } = params;
  try {
    d3.select(timeline)
      .select<HTMLDivElement>(".num-of-days-text")
      .text(`Last ${numOfDays} days`);
  } catch (error) {
    console.error("Error updating number of days text:", error);
  }
}

export function handleDrag(
  event: any,
  handleRadius: number,
  sliderWidth: number,
  setPosition: (value: number) => void,
  data: TimelineData[],
  selectDate: SelectDateFunction
): void {
  try {
    let xPos = event.x - handleRadius;
    xPos = Math.max(0, Math.min(xPos, sliderWidth));
    setPosition(xPos);
    const date =
      new Date(data[0].date).getTime() +
      (xPos / sliderWidth) *
        (new Date(data[data.length - 1].date).getTime() -
          new Date(data[0].date).getTime());
    const closestDate = data.reduce((prev, curr) =>
      Math.abs(new Date(curr.date).getTime() - date) <
      Math.abs(new Date(prev.date).getTime() - date)
        ? curr
        : prev
    ).date;
    selectDate("dateSelected", closestDate);
  } catch (error) {
    console.error("Error handling drag event:", error);
  }
}

export function handleDragEnd(): void {
  // Logic for handleDragEnd if needed
}

export function updateSliderWidth(params: UpdateSliderWidthParams): void {
  const { timeline, handleRadius, setSliderWidth } = params;
  try {
    const width = timeline.clientWidth - handleRadius * 2 - 80;
    setSliderWidth(width);
  } catch (error) {
    console.error("Error updating slider width:", error);
  }
}

export function startAutoSlide(params: StartAutoSlideParams): void {
  const {
    data,
    positionSetter,
    positionGetter,
    sliderWidth,
    speed,
    selectDate,
    setPlayingState,
    animationFrameRef,
  } = params;

  try {
    function slide(): void {
      let currentXPos: number = positionGetter();
      if (currentXPos > sliderWidth) {
        setPlayingState(false);
        cancelAnimationFrame(animationFrameRef.current);
        return;
      }
      positionSetter(currentXPos + speed);
      const dateTimestamp =
        new Date(data[0].date).getTime() +
        (currentXPos / sliderWidth) *
          (new Date(data[data.length - 1].date).getTime() -
            new Date(data[0].date).getTime());
      const closestDate = data.reduce((prev, curr) =>
        Math.abs(new Date(curr.date).getTime() - dateTimestamp) <
        Math.abs(new Date(prev.date).getTime() - dateTimestamp)
          ? curr
          : prev
      ).date;
      selectDate("dateSelected", closestDate);
      animationFrameRef.current = requestAnimationFrame(slide);
    }
    slide();
  } catch (error) {
    console.error("Error starting auto slide:", error);
  }
}

export function rewind(params: RewindParams): void {
  const { positionSetter, data, selectDate } = params;
  try {
    positionSetter(0);
    selectDate("dateSelected", data[0].date);
  } catch (error) {
    console.error("Error rewinding timeline:", error);
  }
}

export function initializeTimeline(params: InitD3TimelineParams): void {
  if (params.timeline) {
    initD3Timeline(params);
  } else {
    console.error("Error: Timeline container is not defined.");
  }
}
