
import * as fs from 'fs';

export function setsData() {
    const filePath: string = 'test/data/sets.dat';
    return fs.readFileSync(filePath, 'utf8');
}

export function setMegData() {
    const filePath: string = 'test/data/set-meg.dat';
    return fs.readFileSync(filePath, 'utf8');
}

export function cardsData() {
    const filePath: string = 'test/data/cards.dat';
    return fs.readFileSync(filePath, 'utf8');
}
