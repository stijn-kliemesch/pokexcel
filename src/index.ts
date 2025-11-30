
// import 

import { INode } from "html5parser";
import { getNodeBody, getNodeText } from "./tcgcollector/html";
import { getHtmlFromUrl, getNodeByIdOrFalse, getNodesMappedToClass, getNodesOfClass } from "./tcgcollector/html.utils";
import { err, tryCatch } from "./util";
import { getCellFormula, getCellRef, getCellValue, getTableContents, load } from "./excel";
import { createBr, createButton, createSpan, createTextField } from "./excel.script";
import { getSheet, SheetPokemon, SheetScript, SheetTest } from "./poke.excel";
import { retrieveSets } from "./tcgcollector/fetcher";

let trigger = false;

const runButton = document.getElementById("run") as HTMLElement;
const rootElement = runButton.parentElement as HTMLElement;

runButton.addEventListener("click", () => tryCatch(run));

async function run() {
  await Excel.run(async (context) => {
    rootElement.removeChild(runButton);

    const pokemonSheet = getSheet(context, SheetPokemon);
    const scriptSheet = getSheet(context, SheetScript);
    
    console.log(await getTableCell(TableSourceData, "Reverse", "Set", "SV1", context));
    console.log(await getTableCell(TableSourceData, "Progress", "Set", "JTG", context));

    console.log(await loadPokexcelSetKeys(context));

    // let html = [await getHtmlFromUrl("https://www.tcgcollector.com/sets/intl")];
    // const setLogoGridsNode = getNodeByIdOrFalse(html[0], "set-logo-grids") || err("set-logo-grids NOT FOUND");
    // const grids = {} as Record<string, Array<INode>>;
    // getNodesMappedToClass(getNodeBody(setLogoGridsNode))
    // ["set-logo-grid"].map((grid) => getNodesMappedToClass(getNodeBody(grid)))
    //   .map(
    //     (gridElementsByClass) =>
    //     (grids[getNodeText(gridElementsByClass["set-logo-grid-title"][0]).trim()] = getNodesOfClass(
    //       gridElementsByClass["set-logo-grid-items"][0],
    //       "set-logo-grid-item",
    //     )),
    //   );
    // // for(const name of Object.keys(idRegistry)) delete idRegistry[name];
    // delete html[0];
    // console.log("... done! Grids stored: " + Object.keys(grids).length);

    // await context.sync();

    // const step2Button = rootElement.appendChild(createButton("step2", "step2"));

    // await context.sync();

    // step2Button.addEventListener("click", async () => {
    //   tryCatch(async () => {
    //     console.log("SourceData");
    //     console.log(await getTableContents("SourceData", "Set", context));
    //     console.log("PersonalCollection");
    //     console.log(await getTableContents("PersonalCollection", "Set", context));
    //     console.log("PersonalProgress");
    //     console.log(await getTableContents("PersonalProgress", "Set", context));
      // })
    // });

    await context.sync();
  });
}

