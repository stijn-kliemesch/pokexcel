import { INode } from "../../node_modules/html5parser/dist/types";
import { getNodeBody, getNodeText } from "./html";
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

export function retrieveSets(sets: INode[]) {

    const setLogoGridsNode = getNodeByIdOrFalse(sets, "set-logo-grids") || err("set-logo-grids NOT FOUND");

    const grids = {} as Record<string, Array<INode>>;
    getNodesMappedToClass(getNodeBody(setLogoGridsNode))
    ["set-logo-grid"].map((grid) => getNodesMappedToClass(getNodeBody(grid)))
        .map(
        (gridElementsByClass) =>
        (grids[getNodeText(gridElementsByClass["set-logo-grid-title"][0]).trim()] = getNodesOfClass(
            gridElementsByClass["set-logo-grid-items"][0],
            "set-logo-grid-item",
        )),
        );

    return grids;

}