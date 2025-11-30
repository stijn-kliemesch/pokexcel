
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

    const grids = retrieveSets();

    await context.sync();
  });
}

