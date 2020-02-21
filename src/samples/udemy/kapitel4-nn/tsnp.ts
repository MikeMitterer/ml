export const random = {
    choice: (max: number): number => {
        return Math.floor(Math.random() * Math.floor(max + 1));
    },

    /**
     * Returns a random number between the specified values.
     * The returned value is no lower than (and may possibly equal) [[low]],
     * and is less than (and not equal) [[max]]
     */
    uniform: (low: number = 0, heigh: number = 1): number => {
        return Math.random() * (heigh - low) + low;
    }
};

/** Verbindet zwei Arrays in  ein zweidimensionales Array */
export function zip<T>(xs: readonly T[], ys: readonly T[]): readonly T[][] {
    const smallerArray = xs.length < ys.length ? xs : ys;

    return smallerArray
        .map((x, i) => [ xs[i], ys[i] ]);
}

/**
 * Dot-Product oder Skalarprodukt
 *
 * Im Prinzip werden zwei Vektoren miteinander multipliziert und dann
 * aus dem Ergebnis eine Summe gebildet
 *
 * Mehr:
 *      https://www.mathebibel.de/skalarprodukt
 */
export function dot(xs: readonly number[], ys: readonly number[]): number {
    const ziped = zip(xs, ys);
    const mapped = ziped.map(([x, y]) => x * y);
    const reduced = mapped.reduce((a, b) => a + b);
    return reduced;
}

