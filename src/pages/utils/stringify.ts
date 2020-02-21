// tslint:disable-next-line:no-any
export function stringify(value: any, spaces?: number): string {
    if(!value) {
        return '<empty>';
    }

    return JSON.stringify(value, undefined, spaces ?? 4)
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp');
}
