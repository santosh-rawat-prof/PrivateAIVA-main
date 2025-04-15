exports.euclideanDistance = (desc1, desc2) => {
    if (desc1.length !== 128 || desc2.length !== 128) return Infinity;

    return Math.sqrt(
        desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
    );
};