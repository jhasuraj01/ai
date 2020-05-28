/**
 * PROBLEM:-
 * ------------------------------
 * FORMULA:-
 * ------------------------------
 * TO DO:-
 * ---
 * Find Slope: Y = slope / X
 * 
 * ------------------------------
 * DATA:-
 * 
 * { length: input (cm), frequency: output (Hz) }
 */
const traningData = [
    { length: 14.9, frequency: 512 },
    { length: 15.1, frequency: 512 },
    { length: 15, frequency: 512 },
    { length: 15.3, frequency: 480 },
    { length: 15.5, frequency: 480 },
    { length: 15.4, frequency: 480 },
    { length: 16.7, frequency: 426 },
    { length: 16.9, frequency: 426 },
    { length: 16.8, frequency: 426 },
    { length: 18.5, frequency: 384 },
    { length: 18.3, frequency: 384 },
    { length: 18.4, frequency: 384 },
    { length: 23, frequency: 320 },
    { length: 23.2, frequency: 320 },
    { length: 23.1, frequency: 320 }
];

const testingPoints = [27.1, 26.9, 27.00]; // array of lengths

const plotingPoints = traningData.map(data => {
    return { y: data.frequency, x: 1 / data.length }
})
const plot = new Plot(document.getElementById('preview-svg'));

plot.points(plotingPoints);

function predict(x, slope, intercept) {
    return slope / x + intercept
}
function error(point, slope, intercept) {
    return point.frequency - (slope / point.length + intercept)
    // distance of a point from line
    // return Math.abs((point.frequency - slope / point.length - intercept) / Math.sqrt(1 + Math.pow(slope, 2)));
}

/**
 * 7964.69137573419  -35.59314958286857
 * @param {Object} points - { length: Number, frequency: Number }
 * @param {Number} slope 
 * @param {Number} intercept
 * @returns average squared error
 */
function cost(points, slope, intercept) {
    let costSumSquared = 0;
    points.forEach(point => {
        costSumSquared += Math.pow(error(point, slope, intercept), 2);
    });

    return costSumSquared / points.length
}
let slope = 0;
let intercept = 0;
let learningRate = 1;

// Slope:  7964.691375735229
// Intercept:  -35.593149582928554
// Cost:  150.75406944242877

let line = plot.line(slope, intercept);
// console.log(predict(27.1, slope, intercept));

// console.log(cost(traningData, slope, intercept));

/**
 * 
 * @param {Number} slope 
 * @param {Number} intercept
 * 
 * @description
 * 
 * SUBSTITUTION:
 *      x = 1/point.length;
 * SOLUTION:
 *      c = (y - sx - i)^2
 *      dc/ds = -2x(y - sx - i)
 *      dc/di = -2(y - sx - i)
 */
function updateWeights(traningData, slope, intercept, learningRate) {
    let DERIVATIVE_COST_WRT_INTERCEPT = 0, DERIVATIVE_COST_WRT_SLOPE = 0;
    traningData.forEach(point => {
        DERIVATIVE_COST_WRT_SLOPE += -2 / point.length * (point.frequency - slope / point.length - intercept);
        DERIVATIVE_COST_WRT_INTERCEPT += -2 * (point.frequency - slope / point.length - intercept);
    })
    return [
        slope - DERIVATIVE_COST_WRT_SLOPE / traningData.length * learningRate,
        intercept - DERIVATIVE_COST_WRT_INTERCEPT / traningData.length * learningRate
    ];
}
const train = () => {
    let old_slope = slope;
    let old_intercept = intercept;
    let old_cost = new_cost = cost(traningData, slope, intercept);

    // let count = 0;
    const trainer = () => {
        //...
        for (let i = 0; i < 10000; i++) {
            // count++;
            [slope, intercept] = updateWeights(traningData, slope, intercept, learningRate);
            
            new_cost = cost(traningData, slope, intercept);
            if (new_cost > old_cost) {
                learningRate /= 2;
                old_cost = new_cost;
            }
        }
        plot.updateLine(line, slope, intercept);

        if (old_slope !== slope || old_intercept !== intercept) {
            window.requestAnimationFrame(trainer);
            old_slope = slope;
            old_intercept = intercept;
        } else {
            predict_cntr.style.opacity = "1";
        }
        // console.clear();
        // console.log(count, "Learning Rate: ", learningRate);
        // console.log("Slope: ", slope, "Intercept: ", intercept, "Cost: ", cost(traningData, slope, intercept));
        slope_elm.innerText = slope
        y_intercept_elm.innerText = intercept
        error_elm.innerText = Math.sqrt(new_cost);
    }
    window.requestAnimationFrame(trainer);
    // console.log("Slope: ", slope, "Intercept: ", intercept, "Cost: ", cost(traningData, slope, intercept));
}
train()