import 'jest-extended';

describe('object', () => {
    test('lenght', () => {
        const obj1 = {};
        const obj2 = {
            name: "Mike",
            printer(): void {
                // tslint:disable-next-line:no-console
                console.log(this.name);
            }

        };

        expect(Object.entries(obj1).length).toBe(0);
        expect(Object.entries(obj2).length).toBe(2);
    });
});
