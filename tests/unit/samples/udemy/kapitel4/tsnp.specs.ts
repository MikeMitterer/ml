import 'jest-extended';
import { LoggerFactory } from "@mmit/logging";
import { random } from "@/samples/udemy/kapitel4-nn/tsnp";


describe("tsnp", () => {
    const logger = LoggerFactory.getLogger('test.tsnp');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("choice", /* async */ () => {
        const found = [0, 0, 0, 0, 0];
        for(let i = 0; i < 100; i++) {
            found[random.choice(4)]++;
        }
        expect(found[0] > 0).toBe(true);
        expect(found[1] > 0).toBe(true);
        expect(found[2] > 0).toBe(true);
        expect(found[3] > 0).toBe(true);
        expect(found[4] > 0).toBe(true);

        const sum = found.reduce(((previousValue, currentValue) => {
            return previousValue + currentValue;
        }),0);

        expect(sum).toBe(100);

        // logger.info("Found:", found);
    });
});
