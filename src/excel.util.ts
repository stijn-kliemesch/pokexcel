export function columnStringToNumber(columnString : string) {
    let columnNumber = 0;
    const length = columnString.length;

    for (let i = 0; i < length; i++) {
        const char = columnString[i].toUpperCase(); // Convert to uppercase
        const value = char.charCodeAt(0) - 'A'.charCodeAt(0); // Convert character to a 1-based value
        columnNumber = columnNumber * 26 + value; // Update column number
    }

    return columnNumber;
}

export function getColumnFromCellReference(cellReference : string) {
    return cellReference.match(/^\$?([A-Z]+)/i)![1];
}

function getRowFromCellReference(cellReference: string) {
    return cellReference.match(/([A-Z]+\$?)(\d+)/i)![2]
}

export function getCellInts(cell: string) {
    return [Number.parseInt(getRowFromCellReference(cell))-1, columnStringToNumber(getColumnFromCellReference(cell))]
}