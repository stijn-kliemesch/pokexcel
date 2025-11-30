import { getHtmlFromUrl } from "./html.utils";

const urlBase = "https://www.tcgcollector.com"

async function _fetch(path: string) {
    try {
        return await getHtmlFromUrl(urlBase+path)
    } catch (e) {
        console.log(e as any, "error");
        throw "ERROR IN fetch";
    }
}

export async function fetchSet() {
    return _fetch("/sets/intl")
}