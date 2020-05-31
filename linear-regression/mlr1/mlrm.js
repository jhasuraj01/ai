/**
 * Multivariate Linear Regression Model;
 */

const f = (X, WEIGHTS, BIAS) => {
    let result = BIAS;
    X.forEach((xi, i) => {
        result += xi * WEIGHTS[i];
    })
    return result;
}

/**
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns boolean (true or false)
 */
const isDeepStrictEqual_OneDimentionalArray = (arr1, arr2) => {
    const len = arr1.length;
    if (len === arr2.length) {
        for (let i = 0; i < len; i++) {
            if (arr1[i][0] !== arr2[i][0]) {
                return false
            }
        }
        return true
    } else {
        console.warn("[isDeepStrictEqual_OneDimentionalArray]: Array's Length are unequal");
        return false
    }
}

/**
 * 
 * @param {Array} Y - output as per data
 * @param {Array} X - input as per data
 * @param {Array} B - Beta
 * 
 * ERROR:-
 *      E = Y−X∙β
 * ---
 * 
 * @returns E
 */
const errorMatrix = (Y, X, B) => matrix.subtract(Y, matrix.multiply(X, B));

/**
 * 
 * @param {Array} Y - output as per data
 * @param {Array} X - input as per data
 * @param {Array} B - Beta
 * 
 * ERROR:-
 *      E = errorMatrix(Y, X, B)
 * ---
 * SUM OF SQUARED ERROR:- (1 * 1 Matrix)
 *    SSE = Transpose(E) ∙ E
 * ---
 * MEAN SQUARED ERROR:-
 *    MS = SSE / E.length
 * ---
 * 
 * @returns MS
 */
const costMS = (Y, X, B) => {
    const E = errorMatrix(Y, X, B);
    return matrix.multiply(matrix.transpose(E), E)[0][0] / E.length;
}

/**
 * 
 * @param {Array} Y - output as per data
 * @param {Array} X - input as per data
 * @param {Array} B - Beta
 * 
 * @returns gradient = (−2 * Transpose(X)∙(Y−Xβ))/Y.length
 */
const gradientOfCostFunction = (Y, X, B) => {
    return matrix.multiplyByConstant(-2/Y.length, matrix.multiply(matrix.transpose(X), errorMatrix(Y, X, B)))
}


const updateBeta = (Y, X, B, learningRate) => {
    const gradient = gradientOfCostFunction(Y, X, B);
    // console.log("Gradient",...gradient);
    
    // const beta = matrix.subtract(B, matrix.multiplyByConstant(learningRate, gradient));
    return matrix.subtract(B, matrix.multiplyByConstant(learningRate, gradient));
    // return matrix.subtract(B, gradient.map((row, i) => row[0]*learningRate[i][0]));
}

// inverse(transpose(X)∙X)∙(transpose(X)∙Y)
// const updateBeta1 = (Y, X, B, learningRate) => {
//     return matrix.multiply(matrix.inverse(matrix.multiply(matrix.transpose(X),X)), matrix.multiply(matrix.transpose(X), Y));
// }

const train = ({info, Y, X}) => {
    // let LR = new Array(info.featureCount + 1).fill(new Array(1).fill(1)); // modal parameter Beta

    let B = new Array(info.featureCount + 1).fill(new Array(1).fill(0)); // modal parameter Beta
    let cost = costMS(Y, X, B);
    // let gradient = gradientOfCostFunction(Y, X, B)
let learningRate = 1
    let old = {
        beta: B,
        cost: cost,
        // gradient: gradient
    }
    return new Promise((resolve, reject) => {
        const trainer = () => {
            //...
            for (let i = 0; i < 10000; i++) {
                // remember old values
                old.beta = B;
                old.cost = cost;
                // old.gradient = gradient;

                B = updateBeta(Y, X, B, learningRate);
                cost = costMS(Y, X, B);
                // gradient = gradientOfCostFunction(Y, X, B);

                // gradient.forEach((row, i) => {
                //     while(row[0] * old.gradient[i][0] < 0) {
                //         learningRate[i][0] /= 2;
                //         B = updateBeta(Y, X, old.beta, LR);
                //         // cost = costMS(Y, X, B);
                //         gradient = gradientOfCostFunction(Y, X, B);
                //     }
                // });
                while(cost > old.cost) {
                    learningRate /= 2;
                    B = updateBeta(Y, X, old.beta, learningRate);
                    cost = costMS(Y, X, B);
                }
            }
            console.clear();
            console.log(...B, cost);
            
            if (isDeepStrictEqual_OneDimentionalArray(B, old.beta) === false) {
                // call trainer again
                requestAnimationFrame(trainer);
            } else {
                resolve(B);
            }
        }
        // call trainer
        requestAnimationFrame(trainer);
    })
}

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

const init = async () => {
    const { info, answer, dataset } = JSON.parse(await (await fetch('mlrp1.json')).text());
    // dataset[] => {"output":31903,"x1":136,"x2":-249}
    
    const dataLength = info.length;

    let Y = new Array(dataLength).fill(null), X = new Array(dataLength).fill(null);
    
    for (let i = 0; i < dataLength; i++) {
        Y[i] = new Array(1).fill(dataset[i].output);
        X[i] = new Array(info.featureCount + 1).fill(1).map((d, xi) => {
            return dataset[i][`x${xi}`] || 1;
        });
    }
// console.log(X);

    // info = {
    //     featureCount: 1
    // }
    // for (let i = 0; i < dataLength; i++) {
    //     Y[i] = [traningData[i].frequency];
    //     X[i] = [1, 1/traningData[i].length];
    // }
    const BETA = await train({info, Y, X});
    console.log(BETA);
}
document.getElementById('init').addEventListener('click', init);