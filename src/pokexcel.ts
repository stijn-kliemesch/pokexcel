import { load } from "./excel";

export const SheetPokemon = "Pokemon"
export const SheetScript = "Script"
export const SheetTest = "Test"

export async function getSheet(context : Excel.RequestContext, sheetName : string) {
    return (await load(context.workbook.worksheets)).getItem(sheetName)
}
