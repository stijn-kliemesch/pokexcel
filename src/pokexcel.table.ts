import { load } from "./excel";
import { getTableColumnBody, getTableRow, reduceTableRows } from "./excel.table";

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

export async function getTable(tableName : string, context : Excel.RequestContext) {
    return (await load(context.workbook.tables)).getItem(tableName)
}

// export class Pokexcel {
    
//     private _setKeys!: string;
//     public get setKeys() : string {
//         return this._setKeys || ;
//     }
    
// }

export const SetKeyID = "setKey"
export const SetKeyName = "setFullName"
export const SetKeyUrl = "setUrlName"
export const setKeyUrlId = "SetUrlId"

export async function loadPokexcelSetKeys(context : Excel.RequestContext) {
    return reduceTableRows(
        await getTable(TableSets, context)
    )
}
