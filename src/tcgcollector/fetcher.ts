import { INode, ITag } from "../../node_modules/html5parser/dist/types";
import { getAttributeOrFalse, getNodeBody, getNodeText, nodeHasBody } from "./html";
import { getHtmlFromUrl, getNodeByIdOrFalse, getNodesMappedToClass, getNodesOfClass } from "./html.utils";
import { err } from "../util";

const baseUrl = "https://www.tcgcollector.com/"
const setsPath = "sets/"
const cardsPath = "cards/"

const region = "intl" // jp = japan

const setsParameters = "setMode=regularCardVariants&releaseDateOrder=newToOld&displayAs=logos"
const cardsParameters = "releaseDateOrder=newToOld&displayAs=images"

const pagingParameter = "cardsPerPage" //only for cardsPath
const pagingValues = [30,60,120] as const

const variantParameter = "cardVariantTypes"
const modifierParameter = "cardSource"
const raritiesParameter = "rarities"

const allModifier = "all"
const selfModifier = "inCardCollection"
const notselfModifier = "notInCardCollection"
const wishModifier = "inCardWishlist"

const variantSeparator = ","
const raritiesSeparator = ","

export async function retrieveSetsParsedHtml() {
    return await getHtmlFromUrl(`${baseUrl}${setsPath}${region}`);
}

// can start anywhere in the html as long as it still contains "set-logo-grids" 
export function retrieveExpansionsInodes(sets: INode[]) {

    const expansionsListNode = getNodeByIdOrFalse(sets, "set-logo-grids") || err("set-logo-grids NOT FOUND");
    nodeHasBody(expansionsListNode) || err("set-logo-grids HAS NO BODY");

    const grids = {} as Record<string, Array<bodied>>;
    const x = getNodesMappedToClass(getNodeBody(expansionsListNode))["set-logo-grid"] // each node is an expansion (i.e. S&V, S&M, XY, etc.)
        .map(getNodeBody).map(getNodesMappedToClass); // 
    x.map(
            (expansionNode) =>
            (grids[getNodeText(expansionNode["set-logo-grid-title"][0]).trim()] = getNodesOfClass(
                expansionNode["set-logo-grid-items"][0],
                "set-logo-grid-item",
            )),
            );

    return grids;

}

type ExpansionSet = {
    setCode: string | null
    setSymbol: string | null
    setName : string
    setLogo: string
    setReleaseDate: string
    setProgressTrackNumber: string
    setLink: string
}

type bodied = ITag & {
    body: Array<ITag>
}

export function convertInodeToSet(expansionName: string, grids: Record<string, bodied[]>) {

    const expansions = {} as Record<string, Record<string, ExpansionSet>>;
    const sets = {} as Record<string, any>;
    let loadAll = true;
    
    const expansion = expansions[expansionName] = {} as Record<string, ExpansionSet>;
    for(const gridItem of grids[expansionName]) {
      const mappedGridItem = getNodesMappedToClass(gridItem.body, true);
      
      const setName = getNodeText(mappedGridItem['set-logo-grid-item-set-name'][0]).trim();
      const setLink = "https://www.tcgcollector.com"+getAttributeOrFalse(mappedGridItem['set-logo-grid-item-set-name'][0], "href") || err("LINK NOT FOUND")
    
      if(!!mappedGridItem['set-logo-grid-item-status-text']) {
        continue;
      }
    
}

//   output.markdown("Loaded: "+setName);
//   expansion[setName] = {
//     setLink,
//     setCode: mappedGridItem['set-logo-grid-item-set-code'] ? getNodeText(mappedGridItem['set-logo-grid-item-set-code'][0]).trim() : null,
//     setSymbol: mappedGridItem['set-logo-grid-item-set-symbol'] ? getAttributeOrFalse(mappedGridItem['set-logo-grid-item-set-symbol'][0] as ITag, "src", false) || null : null, 
//     setName,
//     setLogo: getAttributeOrFalse(mappedGridItem['set-logo-grid-item-set-logo'][0] as ITag, "src", false)  || err("MISSING LOGO"), 
//     setReleaseDate: getNodeText(mappedGridItem['set-logo-grid-item-release-date'][0]).trim(),
//     setProgressTrackNumber: getNodeText(mappedGridItem['progress-label'][0]).trim()
//   };
// }

// if(Object.keys(expansion).length == 0) {
//   output.text("Empty expansion", "warning");
//   delete expansions['expansionName'];
// }

// // await new Promise(resolve => setTimeout(resolve, 1000));


// } finally { delete grids[expansionName]; } }

// const expansionNames = Object.keys(expansions);

// script2.step({
// title: "💎 Quality Control",
// color: "blue"
// });

// //quality control only
// const randomExpansionName = expansionNames[Math.floor(Math.random() * expansionNames.length)];
// const randomExpansion = expansions[randomExpansionName];
// const setNames = Object.keys(randomExpansion);
// const randomSetName = setNames[Math.floor(Math.random() * setNames.length)];
// const randomSet = randomExpansion[randomSetName];

// output.text("Random expansion: "+randomExpansionName);
// if(randomSet) {
// output.text("Random set: "+randomSetName);//stop breaking it
// output.markdown("Symbol: "+'<img src="'+randomSet.setSymbol+'"/>');
// output.markdown("Logo: "+'<img src="'+randomSet.setLogo+'"/>');
// } else {
// output.text("Expansion has no usable sets for QQ")
// }

// script2.step({
// title: "📡 Synchronizing expansions",
// color: "gray"
// });

// await input.buttonsAsync("", ["continue"]);

// const regionTable = base.getTable("Region");
// const regionRecords = await regionTable.selectRecordsAsync({where: '(Title, eq, "International")'});
// if(regionRecords.records.length == 0) throw "REGION NOT FOUND";
// const region = regionRecords.records[0];

// const expansionTable = base.getTable("Expansion");
// const setTable = base.getTable("Set");

// for(const expansionName of expansionNames) {

// const expansionRecords = await expansionTable.selectRecordsAsync({
//   where: '(Title, eq, "'+expansionName+'")'//TODO: INJECTION SAFETY????
// });

// let expansionRecord : ExpansionTable_Record;
// if(expansionRecords.records.length == 0) {
//   const expansionRecordId = await expansionTable.createRecordAsync({
//     Title: expansionName,
//     Region_id: region.id,
//   });
//   output.text("Inserted record for: "+expansionName);
//   expansionRecord = (await expansionTable.selectRecordAsync(expansionRecordId)) || err("ILLEGALSTATE");
// } else {
//   expansionRecord = expansionRecords.records[0];
//   //TODO: update region?  
//   output.text("Processing expansion: "+expansionName);
// }

// const expansion = expansions[expansionName];

// for(const expansionSetName of Object.keys(expansion)) {

//   const expansionSet = expansion[expansionSetName];

//   const setRecords = await setTable.selectRecordsAsync({
//     where: '(Name, eq, "'+expansionSetName+'")'//TODO: INJECTION SAFETY????
//   });

//   let expansionSetRecordId;
//   if(setRecords.records.length > 1) throw "DUPLICATE DB ENTRIES FOR SET"
//   const freshData = transformToRecord(expansionSet, expansionRecord);
//   if(setRecords.records.length == 0) {
//      expansionSetRecordId = await setTable.createRecordAsync(freshData as any);
//     output.text("Inserted record for set: "+expansionSetName);
//   } else {
//     output.text("Synchronizing set: "+expansionSetName);
//     const setRecord = setRecords.records[0];
//     const testable = {} as Record<keyof typeof freshData, any>;
//     // testable['Name'] = setRecord.getCellValue('Name');

// //TODO: can we simplify by getting the query field selector to preload these?

//     testable['Expansion_id'] = setRecord.getCellValue('Expansion_id') || null;
//     testable['ReleaseDate'] = setRecord.getCellValue('ReleaseDate') || null;
//     testable['Logo'] = setRecord.getCellValue('Logo') || null;
//     testable['ProgressTrackNumber'] = setRecord.getCellValue('ProgressTrackNumber') || null;
//     testable['Code'] = setRecord.getCellValue('Code') || null;
//     testable['Symbol'] = setRecord.getCellValue('Symbol') || null;
//     testable['SetLink'] = setRecord.getCellValue('SetLink') || null;

//     testable['EnergySet'] = setRecord.getCellValue('EnergySet');
//     testable['PromoSet'] = setRecord.getCellValue('PromoSet');

//     let hasUpdates = false;
//     const newData = {} as Record<string, any>; //TODO: can this data be typed from the table fields?
//     for(const testableKey of Object.keys(testable) as (keyof typeof testable)[]) {
//       if(!testable[testableKey] && freshData[testableKey]) {
//         newData[testableKey] = freshData[testableKey];
        
//         // hardskip boolean types
//         if(!setTable.fields.filter(field => field.type == UITypes.Checkbox).find(field => field.name == testableKey)) {
//           hasUpdates = true;
//           output.text("New data: "+testableKey);
//         }
//       }
//     }
//     if(hasUpdates) {
//       output.text("updating...");
//       await setTable.updateRecordAsync(setRecord.id, newData);
//     } else {
//       continue;
//     }
//     //TODO: warn for inverse: data in DB not present in source material
//     // should always trigger on Brilliant Stars (Trainer Gallery)
//     //TODO: detecting stamps can only be done through
//     //- set other?
//     //- finding cards in set that belong to other set
//     //- default/only variant on setview is abnormal? (requires being logged in, viewUser?)
    
//   }
// }
// }

// //Card mapper
// //tcgcollector-like filter?

// script2.step({
// title: "🎉 Finished!",
// color: "green"
// });
// output.text("... done!")

// //TODO: listing per pokemon
// //TODO: cardspace calcs?

// function _getNodesMappedToIdDeep_(nodes: Array<INode>) { try {
// if(!nodes) throw "NODES WAS FALSY";
// const idRegistry = {} as Record<string, INode>;
// walk2(
//   nodes,
//   nodeHasBody,
//   node => {
//     const id = getAttributeOrFalse(node, "id");
//     if(id) {
//       idRegistry[id] = node;
//     }
//     return node.body;
//   }
// );
// return idRegistry;
// } catch (e) { output.text(e as any, "error"); throw "ERROR IN getNodesMappedToIdDeep"; }}
