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
 * @param {Array< Array <Number>>} arr1 
 * @param {Array< Array <Number>>} arr2 
 * @returns {Boolean} true or false
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
 * @param {Array<Array <Number>>} Y - output as per data
 * @param {Array<Array <Number>>} X - input as per data
 * @param {Array<Array <Number>>} B - Beta
 * 
 * ERROR:-
 *      E = Y−X∙β
 * ---
 * 
 * @returns {Array<Array <Number>>} E
 */
const errorMatrix = (Y, X, B) => matrix.subtract(Y, matrix.multiply(X, B));

/**
 * 
 * @param {Array<Array <Number>>} Y - output as per data
 * @param {Array<Array <Number>>} X - input as per data
 * @param {Array<Array <Number>>} B - Beta
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
 * @returns {Number} MS - MEAN SQUARED ERROR
 */
const costMS = (Y, X, B) => {
    const E = errorMatrix(Y, X, B);
    return matrix.multiply(matrix.transpose(E), E)[0][0] / E.length;
}

/**
 * 
 * @param {Array<Array <Number>>} Y - output as per data
 * @param {Array<Array <Number>>} X - input as per data
 * @param {Array<Array <Number>>} B - Beta
 * @returns {Array<Array <Number>} gradient = (−2 * Transpose(X)∙(Y−Xβ))/Y.length
 */
const gradientOfCostFunction = (Y, X, B) => {
    return matrix.multiplyByConstant(-2/Y.length, matrix.multiply(matrix.transpose(X), errorMatrix(Y, X, B)))
}

/**
 * 
 * @param {Array<Array <Number>>} Y - output as per data
 * @param {Array<Array <Number>>} X - input as per data
 * @param {Array<Array <Number>>} B - Beta
 * @param {Number} learningRate - Learning Rate Constant
 * @returns {Array<Array <Number>>} Expected Beta
 */
const updateBeta = (Y, X, B, learningRate) => {
    const gradient = gradientOfCostFunction(Y, X, B);    
    return matrix.subtract(B, matrix.multiplyByConstant(learningRate, gradient));
}

const train = ({info, Y, X}) => {
    let B = new Array(info.featureCount + 1).fill(new Array(1).fill(0)); // modal parameter Beta
    let cost = costMS(Y, X, B);
    setupOutputDisplay(info, B, cost);
    let learningRate = 1
    let old = {
        beta: B,
        cost: cost
    }
    return new Promise((resolve, reject) => {
        const trainer = () => {
            //...
            for (let i = 0; i < 1000; i++) {
                // remember old values
                old.beta = B;
                old.cost = cost;

                B = updateBeta(Y, X, B, learningRate);
                cost = costMS(Y, X, B);

                while(cost > old.cost) {
                    learningRate /= 2;
                    B = updateBeta(Y, X, old.beta, learningRate);
                    cost = costMS(Y, X, B);
                }
            }
            if (isDeepStrictEqual_OneDimentionalArray(B, old.beta) === false) {
                // call trainer again
                displayOutput(B, cost);
                requestAnimationFrame(trainer);
            } else {
                resolve([B, cost]);
            }
        }
        // call trainer
        requestAnimationFrame(trainer);
    })
}

const init = async () => {
    stateHeader.innerText = 'State: Loading Data...';
    const { info, dataset } = JSON.parse(await (await fetch('mlrp1.json')).text());
    
    const dataLength = info.length;

    let Y = new Array(dataLength).fill(null), X = new Array(dataLength).fill(null);
    
    for (let i = 0; i < dataLength; i++) {
        Y[i] = new Array(1).fill(dataset[i].output);
        X[i] = new Array(info.featureCount + 1).fill(1).map((d, xi) => dataset[i][`x${xi}`]);
    }
    const [BETA, COST] = await train({info, Y, X});

    // DOM Manipulation
    init_btn.disabled = false;
    init_btn.innerText = 'Restart Solving';
    displayOutput(BETA, COST);
    stateHeader.innerText = 'State: Solved';
}
init_btn.addEventListener('click', init);