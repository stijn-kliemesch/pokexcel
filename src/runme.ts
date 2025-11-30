import { findFirstAsyncRace } from "./util";

try {
const x = [1,2,3,4,5,6];
const y = await findFirstAsyncRace(x, async e => e > 6);

console.log(y)
} catch (e) {
    console.log("lel")
    console.log(e)
    throw e
}

