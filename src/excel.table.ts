import { load } from "./excel";
import { err, findFirstAsyncRace } from "./util";

export async function getTableColumnBody(table: Excel.Table, targetColumnRef: string) {
    return await load(await load((await load(table.columns)).getItem(targetColumnRef).getDataBodyRange()));
}

export async function getTableHeaders(table: Excel.Table) {
    return (await load(table.getHeaderRowRange())).values.map(e=>e[0]) as string[]
}

export async function getTableHeaderIndex(table: Excel.Table, keyColumnref: string) {
    return (await load(table.getHeaderRowRange())).values.map(e=>e[0]).findIndex((e) => e == keyColumnref);
}

export async function getTableRowCell(row: Excel.TableRow, keyIndex: number) {
    return (await load(row.getRange())).values[keyIndex][0]
}

//TODO; ref or just give it the table?
export async function getTableCell(tableref: string, targetColumnRef: string, keyColumnref: string, key: string, context: Excel.RequestContext) {
    const table = await getTable(tableref, context);
    const rows = await load(table.rows);

    const targetColumnBody = await getTableColumnBody(table, targetColumnRef);
    const keyIndex = await getTableHeaderIndex(table, keyColumnref);

    return targetColumnBody.values[
        (await findFirstAsyncRace<Excel.TableRow[]>(// how did i break this?
            rows.items, 
            async row => (console.log(await getTableRowCell(row, keyIndex)),await getTableRowCell(row, keyIndex)) == key)
        ).index
    ][0];
        
        // || err(new Error(`Could not find record where ${keyColumnref} held ${key}`))

    for(let i = 0; i < rows.items.length; ++i) {
        if(await getTableRowCell(rows.items[i], keyIndex) == key) {
            return targetColumnBody.values[i][0];
        }
    }

    throw new Error(`Could not find record where ${keyColumnref} held ${key}`);
}

//TODO; ref or just give it the table?
export async function getTableRow(tableref: string, keyColumnref: string, key: string, context: Excel.RequestContext) {
    const table = await getTable(tableref, context);
    const rows = await load(table.rows);

    const keyIndex = await getTableHeaderIndex(table, keyColumnref);

    for(let i = 0; i < rows.items.length; ++i) {
        if(await getTableRowCell(rows.items[i], keyIndex) == key) {
            return rows.items[i]
        }
    }

    throw new Error(`Could not find record where ${keyColumnref} held ${key}`);
}

export async function reduceTableRows<T>(table: Excel.Table, 
    // init: T, 
    // reducer: (previousValue: T, currentValue: Record<string,string>, currentIndex: number, array: Excel.TableRow[]) => T
) {
    const headers = await getTableHeaders(table);
    const x = (await load(table.rows)).items;
    const y = x.map(e=>e.values)
    const z = y.map(e=>e[0][0])
    return z;
    // return (await load(table.rows)).items.
    //     reduce(
    //     (acc,cur,i,arr) => 
    //         reducer(acc,
    //         //cur!!!
    //         headers.reduce((acc2, cur2, i2, arr2) => (acc2[headers[i2]] = cur2, acc2), {} as Record<string,string>)
    //         ,i,arr),
    //     init
    // );
}

export async function getTable(tableref: string, context: Excel.RequestContext) {
    const tableCollection = await load(context.workbook.tables);
    return tableCollection.getItem(tableref);
}



type MappedRow = { [k: string] : string } & { _sourceRow_ : Excel.TableRow }
type MappedTable = { [k: string] : MappedRow } & { _sourceTable_ : Excel.Table }

// @Deprecated
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