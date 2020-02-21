import 'jest-extended';

// interface ClockConstructor {
//     new (hour: number, minute: number): ClockInterface;
// }

type ClockConstructor = new (hour: number, minute: number) => ClockInterface;

interface ClockInterface {
    tick(): string;
}

// Variante I
class Surmer implements ClockInterface {
    // tslint:disable-next-line:no-empty
    constructor(h: number, m: number) {}

    public tick(): string {
        return 'surm surm';
    }
}

// Variante II
// tslint:disable-next-line:variable-name
const Clock1: ClockConstructor = class Clock implements ClockInterface {
    // tslint:disable-next-line:no-empty
    constructor(h: number, m: number) {}

    public tick(): string {
        return 'beep beep';
    }
};

const clockFactory = (ctor: ClockConstructor): ClockInterface => {
    const now = new Date();
    return new ctor(now.getHours(), now.getMinutes());
};

describe('ctor.interface', () => {
    // const logger = LoggerFactory.getLogger('test.ctor.interface');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test('Create ', /* async */ () => {
        const c1 = new Clock1(12, 49);
        expect(c1.tick()).toBe('beep beep');

        const c2 = new Surmer(12, 49);
        expect(c2.tick()).toBe('surm surm');

        const c3 = clockFactory(Clock1);
        expect(c3.tick()).toBe('beep beep');

        const c4 = clockFactory(Surmer);
        expect(c4.tick()).toBe('surm surm');
    });
});
