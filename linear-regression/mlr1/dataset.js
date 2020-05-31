const { writeFile, stat, createReadStream, createWriteStream } = require("fs");
const { createBrotliCompress/*, createGzip */} = require("zlib")

function rand(min, max) {
    const ans = Math.round(Math.random() * (max - min) + min);
    return ans;
}

const DATASET_NAME = "MLRP1";
// multivariate Linear Regression Problem 
/**
 * EQUATION FORMAT:
 * y3 = a0 + a1*x1 + a2*x2
 * 
 * CONSTANTS TO LEARN:
 *   a0 = 67
 *   a1 = 56
 *   a2 = 678
 * 
 */

// Parameters
const ERROR_RANGE = 100;
const dataLength = 3000;      // amount of data
const featureCount = 5;     // number of variables
const WEIGHT_RANGE = 300;
const INPUT_RANGE = 300;
const BIAS = rand(-100, 100);

const WEIGHTS = [BIAS, ...(new Array(featureCount)).fill(null).map(d => rand(-WEIGHT_RANGE, WEIGHT_RANGE))];


const f = X => {
    let result = 0;
    X.forEach((xi, i) => {
        result += xi * WEIGHTS[i];
    })
    return result;
}

let data = {
    info: {
        length: dataLength,
        featureCount: featureCount,
        error_range: ERROR_RANGE,
        weight_range: WEIGHT_RANGE,
        input_range: INPUT_RANGE,
        name: DATASET_NAME,
        weights: WEIGHTS
    },
    dataset: (new Array(dataLength)).fill(null).map((d, i) => {
        const X = [1, ...(new Array(featureCount)).fill(null).map(xi => {
            return rand(-INPUT_RANGE, INPUT_RANGE);
        })];

        let data = {
            output: f(X) + rand(-ERROR_RANGE, ERROR_RANGE)
        };

        X.forEach((xi, i) => {
            data[`x${i}`] = xi;
        })

        return data;
    })
}
writeFile(__dirname +"/"+ DATASET_NAME.toLowerCase() + ".json", JSON.stringify(data), "utf8", function (err) {
    if (err) {
        console.error(err)
    }
    else {
        console.log("Success!");

        const br_compressor = createBrotliCompress();
        // const gz_compressor = createGzip();
        const reader = createReadStream(__dirname +"/"+ DATASET_NAME.toLowerCase() + ".json");
        const br_writer = createWriteStream(__dirname +"/"+ DATASET_NAME.toLowerCase() + ".json.br");
        // const gz_writer = createWriteStream(__dirname +"/"+ DATASET_NAME.toLowerCase() + ".json.gz");
        
        reader.pipe(br_compressor).pipe(br_writer);
        // reader.pipe(gz_compressor).pipe(gz_writer);

        stat(__dirname +"/"+ DATASET_NAME.toLowerCase() + ".json", function (err, stats) {
            if (err) {
                console.error(err)
            } else {
                console.log(stats);
            }
        })
    }
})