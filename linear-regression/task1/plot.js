const NS_URI = "http://www.w3.org/2000/svg";
class Plot {
    constructor(svgCanvas) {
        this.W = svgCanvas.width.baseVal.value;
        this.H = svgCanvas.height.baseVal.value;
        this.svgCanvas = svgCanvas;
        this.X_AXIS_1_UNIT = 0.00019;
        this.Y_AXIS_1_UNIT = 600 / this.H;
    }
    points(dataArray) {
        const df = new DocumentFragment();
        dataArray.forEach(point => {
            const circle = document.createElementNS(NS_URI, "circle");
            circle.setAttributeNS(null, "cx", point.x / this.X_AXIS_1_UNIT);
            circle.setAttributeNS(null, "cy", this.H - point.y / this.Y_AXIS_1_UNIT);
            circle.setAttributeNS(null, "r", 3);
            circle.setAttributeNS(null, "fill", "#777777");
            df.append(circle);
        });
        this.svgCanvas.append(df);
    }

    line(slope, intercept) {
        const y = x => slope * x + intercept;
        const x = y => (y - intercept) / slope;

        const y0 = y(0) > 0 ? y(0) : 0;
        const x0 = x(0) > 0 ? x(0) : 0;
        const yW = y(this.W * this.X_AXIS_1_UNIT) > this.H * this.Y_AXIS_1_UNIT ? this.H * this.Y_AXIS_1_UNIT : y(this.W * this.X_AXIS_1_UNIT);
        const xW = x(this.H * this.Y_AXIS_1_UNIT) > this.W * this.X_AXIS_1_UNIT ? this.W * this.X_AXIS_1_UNIT : x(this.H * this.Y_AXIS_1_UNIT);

        return this.lineByPoints(x0, y0, xW, yW);
        // console.log(0, y0, xW, yW);
    }
    lineByPoints(x1, y1, x2, y2) {
        const line = document.createElementNS(NS_URI, "line");
        line.setAttributeNS(null, "x1", x1 / this.X_AXIS_1_UNIT);
        line.setAttributeNS(null, "y1", this.H - y1 / this.Y_AXIS_1_UNIT);
        line.setAttributeNS(null, "x2", x2 / this.X_AXIS_1_UNIT);
        line.setAttributeNS(null, "y2", this.H - y2 / this.Y_AXIS_1_UNIT);
        line.setAttributeNS(null, "stroke", "#0a724f");
        line.setAttributeNS(null, "stroke-width", 3);
        this.svgCanvas.append(line);
        return line;
    }
    updateLine(line, slope, intercept) {
        const y = x => slope * x + intercept;
        const x = y => (y - intercept) / slope;

        const y1 = y(0) > 0 ? y(0) : 0;
        const x1 = x(0) > 0 ? x(0) : 0;
        const y2 = y(this.W * this.X_AXIS_1_UNIT) > this.H * this.Y_AXIS_1_UNIT ? this.H * this.Y_AXIS_1_UNIT : y(this.W * this.X_AXIS_1_UNIT);
        const x2 = x(this.H * this.Y_AXIS_1_UNIT) > this.W * this.X_AXIS_1_UNIT ? this.W * this.X_AXIS_1_UNIT : x(this.H * this.Y_AXIS_1_UNIT);

        line.setAttributeNS(null, "x1", x1 / this.X_AXIS_1_UNIT);
        line.setAttributeNS(null, "y1", this.H - y1 / this.Y_AXIS_1_UNIT);
        line.setAttributeNS(null, "x2", x2 / this.X_AXIS_1_UNIT);
        line.setAttributeNS(null, "y2", this.H - y2 / this.Y_AXIS_1_UNIT);
    }
}