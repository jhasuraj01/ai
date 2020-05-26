const NS_URI = "http://www.w3.org/2000/svg";
const previewSvg = document.getElementById("preview-svg");
const errorDisplayDiv = document.getElementById('error');
let isTrainingAllowed = true;
let animFrame;
let trainer;
/**
 * Here we will draw line using 2 points - (x1, y1) and (x2, y2).
 * ----------------------------------------
 * ASSUMPTION: Divider Line will always touch top and bottom side of box;
 * hence, we will consider a point - (x1, 0) and (x2, H)
 *                                                      ..... where H = height of box.
 * Therefore For each line we have only two variables.
 * ----------------------------------------
 * EQUATION OF A LINE:
 * 
 *      y - 0          x - x1
 *    ---------  =  -----------
 *      H - 0         x2 - x1
 * 
 *      y            x              x1
 *    -----  =  -----------  -  -----------
 *      H         x2 - x1         x2 - x1
 * 
 *                 H * x           H * x1
 *      y    =  -----------  -  -----------
 *                x2 - x1         x2 - x1
 * ASSUMPTION:
 *                   H
 *      w1   =  -----------
 *                x2 - x1
 * 
 *                 H * x1
 *      w2   =  -----------
 *                x2 - x1
 * 
 * THEREFORE:
 *      y    =   w1 * x  -  w2
 * 
 */
const train = async () => {
    isTrainingAllowed = false;
    
    const line = putRandomLine("#0a724f", "0");

    const trainingPoints = randomPoints(1000)
    // let score = evaluateError(trainingPoints, line);
    let errorf = errori = evaluateError(trainingPoints, line);

    trainer = async () => {
        console.log(errorf, errorf.toPrecision(2));

        let d1 = d2 = Math.exp(-1 / errorf);
        const cases = [];
        changeXCoordinate(line, d1, d2);
        cases.push({
            err: evaluateError(trainingPoints, line),
            d1: d1,
            d2: d2
        })
        changeXCoordinate(line, -2 * d1, 0);
        cases.push({
            err: evaluateError(trainingPoints, line),
            d1: -d1,
            d2: d2
        })
        changeXCoordinate(line, 2 * d1, -2 * d2);
        cases.push({
            err: evaluateError(trainingPoints, line),
            d1: d1,
            d2: -d2
        })
        changeXCoordinate(line, -2 * d1, 0);
        cases.push({
            err: evaluateError(trainingPoints, line),
            d1: -d1,
            d2: -d2
        })

        errorf = cases[0].err;
        errorDisplayDiv.innerText = errorf;
        cases.sort((a, b) => a.err - b.err)
        changeXCoordinate(line, d1 + cases[0].d1, d2 + cases[0].d2)

        if (errorf.toPrecision(2) > 0.01) {
            animFrame = window.requestAnimationFrame(trainer);
        } else {
            isTrainingAllowed = true;
            trainingTglBtn.innerText = "Add New Line"
        }
    }
    animFrame = window.requestAnimationFrame(trainer);

}

const colourisePoints = () => {
    testingPoints.forEach(point => {
        const pos = getPointPosition(point, realLine);
        let color = "gray";
        switch (pos) {
            case "left":
                color = "red";
                break;
            case "right":
                color = "blue";
                break;
            case "over":
                color = "black";
                break;
        }
        point.node.setAttributeNS(null, "fill", color);
    })
}

// setTimeout(train, 1000);
const changeXCoordinate = (line, d1, d2) => {
    line.x1 += d1;
    line.x2 += d2;
    line.node.setAttributeNS(null, "x1", line.x1);
    line.node.setAttributeNS(null, "x2", line.x2);
}
const getWeights = (line) => {
    return {
        w1: (previewSvg.height.baseVal.value) / (line.x2 - line.x1),
        w2: (previewSvg.height.baseVal.value * line.x1) / (line.x2 - line.x1)
    }
}
const evaluateError = (points, line) => {
    let result = 0;
    points.forEach(point => {
        const realPosition = getPointPosition(point, realLine);
        const position = getPointPosition(point, line);
        result += (realPosition === position ? 0 : distancePointLine(point, line));
    });
    return result;
}
const distancePointLine = (point, line) => {
    const { w1, w2 } = getWeights(line);
    return Math.abs((point.y - w1 * point.x + w2) / (Math.sqrt(1 + Math.pow(w1, 2))));
}
const getPointPosition = (point, line) => {
    const { w1, w2 } = getWeights(line);
    const Sx = point.x - (point.y + w2) / w1;

    if (Sx > 0) {
        return 'right';

    } else if (Sx < 0) {
        return 'left';

    } else {
        return "over"
    }
}
const putPoints = (points) => {
    const fr = new DocumentFragment();
    let pointElmArr = new Array(points.length)
    points.forEach((point, index) => {
        const circle = document.createElementNS(NS_URI, "circle");
        circle.setAttributeNS(null, "cx", point.x);
        circle.setAttributeNS(null, "cy", point.y);
        circle.setAttributeNS(null, "r", 3);
        circle.setAttributeNS(null, "fill", "#777777");

        point.node = circle;
        pointElmArr[index] = point;
        fr.append(circle);
    });
    previewSvg.append(fr);
    return pointElmArr;
}
const putRandomLine = (color, strokeDasharray) => {
    const x1 = rand(0, previewSvg.width.baseVal.value);
    const x2 = rand(0, previewSvg.width.baseVal.value);
    const line = document.createElementNS(NS_URI, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", 0);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y2", previewSvg.height.baseVal.value);
    line.setAttributeNS(null, "stroke", color);
    line.setAttributeNS(null, "stroke-width", 3);
    line.setAttributeNS(null, "stroke-dasharray", strokeDasharray);
    previewSvg.append(line);
    return {
        x1: x1,
        x2: x2,
        node: line
    };
}

const randomPoints = (num) => {
    let points = new Array(num);
    for (let i = 0; i < num; i++) {
        points[i] = randomPoint();
    }
    return points;
}
const randomPoint = () => {
    return { x: rand(0, previewSvg.width.baseVal.value), y: rand(0, previewSvg.height.baseVal.value) }
}

window.rand = function (min, max) {
    return (Math.random() * (max - min) + min)
}

let realLine = {
    x1: rand(0, previewSvg.width.baseVal.value),
    x2: rand(0, previewSvg.width.baseVal.value)
};
let testingPoints = putPoints(randomPoints(250));
colourisePoints();

trainingTglBtn = document.getElementById('training-tgl-btn');
trainingTglBtn.addEventListener('click', () => {
    if(trainingTglBtn.innerText !== "Pause Training") {
        trainingTglBtn.innerText = "Pause Training";
        if(isTrainingAllowed) {
            train();
        } else {
            animFrame = window.requestAnimationFrame(trainer)
        }
    } else {
        trainingTglBtn.innerText = "Start Training";
        if (isTrainingAllowed === false) {
            window.cancelAnimationFrame(animFrame)
        }
    }
});
document.getElementById('refresh-btn').addEventListener('click', () => {
    if (isTrainingAllowed === false) {
        window.cancelAnimationFrame(animFrame)
    }
    previewSvg.innerHTML = "";
    trainingTglBtn.innerText = "Start Training";
    errorDisplayDiv.innerText = "None"
    realLine = {
        x1: rand(0, previewSvg.width.baseVal.value),
        x2: rand(0, previewSvg.width.baseVal.value)
    };
    testingPoints = putPoints(randomPoints(250));
    colourisePoints();
    isTrainingAllowed = true;
});