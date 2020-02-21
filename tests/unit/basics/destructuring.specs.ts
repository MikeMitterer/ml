import 'jest-extended';

describe('destructuring', () => {
    // const logger = LoggerFactory.getLogger('test.destructuring');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test('Object', /* async */ () => {
        const obj = { name: 'Mike', lastname: 'Mitterer', age: 99 };
        const { age } = obj;

        expect(age).toBe(99);
    });
});
