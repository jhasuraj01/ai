(function () {
    function Matrix() {
        return this;
    }

    /**
     * @param {Array} MAT 
     * @returns boolen (true or false)
     */
    Matrix.prototype.transpose = Matrix.prototype.T = function (MAT) {
        // const MAT_H = MAT.length;
        // const MAT_W = MAT[0].length;
        // const transpose = new Array(MAT_W).fill(null).map((n, r) => new Array(MAT_H).fill(null).map((n, c) => MAT[c][r]))

        return new Array(MAT[0].length).fill(null).map((n, r) => new Array(MAT.length).fill(null).map((n, c) => MAT[c][r]))
    }
    Matrix.prototype.subtract = Matrix.prototype.S = function (MAT1, MAT2) {
        return MAT1.map((row, ri) => row.map((elm, ci) => elm - MAT2[ri][ci]));
    }
    Matrix.prototype.multiply = Matrix.prototype.M = function (MAT1, MAT2) {
        if (MAT1[0].length !== MAT2.length) {
            console.error(MAT1, "Can Not Be Multiplied By", MAT2);
            throw new Error('Matrix Can Not Be Multiplied')
        }
        let result = new Array(MAT1.length).fill(null).map((n, r) => new Array(MAT2[0].length).fill(0));

        for (let i = 0; i < result.length; i++) {
            for (let k = 0; k < result[0].length; k++) {
                for (let j = 0; j < MAT1[0].length; j++) {
                    result[i][k] += MAT1[i][j] * MAT2[j][k];
                }
            }
        }
        return result;
    }
    Matrix.prototype.multiplyByConstant = Matrix.prototype.MBC = function (c, MAT) {
        return MAT.map(row => row.map(elm => elm * c));
    }
    // TO DO: logic for determinant
    Matrix.prototype.determinant = Matrix.prototype.det = function (MAT) {
        if(MAT.length !== MAT[0].length) {
            console.error("Determinent of", MAT, "is Null");
            throw new Error("Determinent of a Matrix is Null")
        }
    }
    // TO DO: logic for inverse
    Matrix.prototype.inverse = function (MAT) {
        // const determinant = this.det();
        // if (determinant.value() === 0) return null;

        // let newMatrix = this.adjoint();
        // for (let row = 0; row < this.height; row++) {
        //     for (let col = 0; col < this.width; col++) {
        //         newMatrix.value[row][col] = newMatrix.value[row][col].divide(determinant);
        //     }
        // }
        // return newMatrix;
    }
    window.matrix = new Matrix();
})()