
import * as fs from 'fs';

export function setsData() {
    const filePath: string = 'test/data/sets.dat';
    return fs.readFileSync(filePath, 'utf8');
}