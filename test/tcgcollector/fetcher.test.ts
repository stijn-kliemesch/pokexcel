import { parse } from "html5parser";
import { retrieveSets, retrieveSetsParsedHtml } from "../../src/tcgcollector/fetcher";
import { setsData } from "../util/testdata"

describe('test fetcher', () => {

    test("simple test retrieveSets", async () => {
        expect(async () => { 
            const sets = retrieveSets(parse(setsData()));
            expect(Object.keys(sets)).toStrictEqual([
                'Mega Evolution Series',
                'Scarlet & Violet Series',
                'Sword & Shield Series',
                'Sun & Moon Series',
                'XY Series',
                'Black & White Series',
                'Call of Legends Series',
                'HeartGold & SoulSilver Series',
                'Platinum Series',
                'Diamond & Pearl Series',
                'EX Series',
                'e-Card Series',
                'Legendary Collection Series',
                'Neo Series',
                'Original Series',
                'Trainer & Deck Kits',
                'Play! Pokémon Series',
                'World Championships Decks',
                "McDonald's Series",
                'Unnumbered Energies',
                'Other',
            ])
            return true; 
        }).resolves.toBeTruthy()
    })

    // do not run this except manually on rare occasion, do not bother their servers unnecessarily
    // test("simple test retrieveSets", async () => {
    //     expect(async () => { 
    //         const sets = retrieveSets(await retrieveSetsParsedHtml());
    //         expect(Object.keys(sets)).toStrictEqual([
    //             'Mega Evolution Series',
    //             'Scarlet & Violet Series',
    //             'Sword & Shield Series',
    //             'Sun & Moon Series',
    //             'XY Series',
    //             'Black & White Series',
    //             'Call of Legends Series',
    //             'HeartGold & SoulSilver Series',
    //             'Platinum Series',
    //             'Diamond & Pearl Series',
    //             'EX Series',
    //             'e-Card Series',
    //             'Legendary Collection Series',
    //             'Neo Series',
    //             'Original Series',
    //             'Trainer & Deck Kits',
    //             'Play! Pokémon Series',
    //             'World Championships Decks',
    //             "McDonald's Series",
    //             'Unnumbered Energies',
    //             'Other',
    //         ])
    //         return true; 
    //     }).resolves.toBeTruthy()
    // })
});