import * as fs from "fs";

const bootstrapDataDir = "test/data/"

async function bootstrapFile(file: string, url: string) {

    const fetched = await fetch(url);
    fs.writeFile(file, (await fetched.text()).trim(), err => {
        console.log(url)
        console.log(file)
        if(err) {
            console.log("error");
            console.log(err);
        } else {
            console.log("success")
        }
    })

}

// do not run this except manually on rare occasion, do not bother their servers unnecessarily

await bootstrapFile(`${bootstrapDataDir}sets.dat`, "http://www.tcgcollector.com/sets/intl")
await bootstrapFile(`${bootstrapDataDir}set-meg.dat`, "https://www.tcgcollector.com/sets/11662/mega-evolution")
await bootstrapFile(`${bootstrapDataDir}cards.dat`, "https://www.tcgcollector.com/cards/intl")

export default true