import { getCellInts } from "./excel.util";

export async function load<
    T extends {
        load: (...args: any) => any;
        context: Excel.RequestContext;
    },
>(element: T): Promise<ReturnType<T["load"]>> {
    const x = element.load();
    await element.context.sync();
    return x;
}

type MappedRow = { [k: string] : string } & { _sourceRow_ : Excel.TableRow }
type MappedTable = { [k: string] : MappedRow } & { _sourceTable_ : Excel.Table }

export async function getCellRef(sheetref: string, cellref: string, context: Excel.RequestContext) {
    const sheets = await load(context.workbook.worksheets);
    const cellInts = getCellInts(cellref);
    return sheets.getItem(sheetref).getCell(cellInts[0], cellInts[1]);
}

export async function getCellValue(sheetref: string, cellref: string, context: Excel.RequestContext) {
    return (await load(await getCellRef(sheetref, cellref, context))).values[0][0]
}

export async function getCellFormula(sheetref: string, cellref: string, context: Excel.RequestContext) {
    return (await load(await getCellRef(sheetref, cellref, context))).formulas[0][0]
}

export async function getTableContents(tableName: string, keyColumn: string, context: Excel.RequestContext) {
    const tableCollection = await load(context.workbook.tables);

    const tablesMap = tableCollection.items.reduce(
        (acc, el) => ((acc[el.name] = el), acc),
        {} as Record<string, Excel.Table>,
    );

    let sourceDataPointers = await load(tablesMap[tableName].rows);

    const sourceData = await Promise.all(sourceDataPointers.items.map(async (e) => await load(e)));

    let sourceDataHeaders = (await load(tablesMap[tableName].getHeaderRowRange())).values;

    const keyIndex = sourceDataHeaders[0].findIndex((e) => e == keyColumn);

    const mappedData = sourceData.reduce(
        (mappedRows, sourceRow) => (
            (mappedRows[sourceRow.values[0][keyIndex]] = sourceRow.values[0].reduce(
                (mappedCells : MappedRow, sourceCell, index) => ((mappedCells[sourceDataHeaders[0][index]] = sourceCell), (mappedCells._sourceRow_ = sourceRow), mappedCells),
                {} as MappedRow,
            )),
            mappedRows
        ),
        {} as MappedTable,
    );

    mappedData._sourceTable_ = tablesMap[tableName];

    return mappedData;
}

// ✅: create cell lookup
// TODO: create table lookup
// TODO: create global loaded cache with force reload mechanism
// TODO: make cell lookup use global loaded cache
// TODO: make table lookup use global loaded cache
// TODO: create fetch cache
// - mind composite keys

