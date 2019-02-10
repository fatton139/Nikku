import { MathUtil } from "math/MathUtil";

export const LevenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0 || b.length === 0) {
        return a.length === 0 ? b.length : a.length;
    }
    const matrix: number[][] = MathUtil.zeros(a.length + 1, b.length + 1);
    for (let i = 1; i < matrix.length; i++) {
        matrix[i][0] = i;
    }
    for (let i = 1; i < matrix[0].length; i++) {
        matrix[0][i] = i;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            b[i - 1] === a[j - 1] ?
            matrix[i][j] = matrix[i - 1][j - 1] :
            matrix[i][j] = Math.min(
                Number(matrix[i - 1][j]) + 1,
                Number(matrix[i][j - 1]) + 1,
                Number(matrix[i - 1][j - 1]) + 1,
            );
        }
    }
    return matrix[b.length][a.length];
};
