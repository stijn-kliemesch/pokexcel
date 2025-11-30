import { load } from "./excel";

export const SheetPokemon = "Pokemon"
export const SheetScript = "Script"
export const SheetTest = "Test"

export async function getSheet(context : Excel.RequestContext, sheetName : string) {
    return (await load(context.workbook.worksheets)).getItem(sheetName)
}

export const TableSourceData = "SourceData"
export const TableCollection = "PersonalCollection"
export const TableProgress = "PersonalProgress"
export const TableFractions = "ProgressFractions"

export const TableRarities = "PokemonRarities"
export const TableSets = "PokemonSetKeys"
export const TableSetRarities = "PokemonSetRarities"
export const TableVariants = "PokemonVariants"
export const TableSetVariants = "PokemonSetVariants"

export const TableScriptKeys = "ScriptKeys"

export async function getTable(context : Excel.RequestContext, sheetName : string) {
    return (await load(context.workbook.tables)).getItem(sheetName)
}