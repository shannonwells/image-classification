import * as https from "https";
import * as dotenv  from "dotenv"
dotenv.config()

type RijksImage = {
    guid: string
    offsetPercentageX: number
    offsetPercentageY: number
    width: number
    height: number
    url: string
}

type RijksObjekt = {
    links: Array<{self: string, web: string}>
    id: string
    objectNumber: string
    title: string
    hasImage: boolean
    principalOrFirstMaker: string
    longTitle: string
    showImage: boolean
    permitDownload: boolean
    webImage: RijksImage
    headerImage: RijksImage
    productionPlaces: Array<string>
}

type RijksFacets = {
    facet: Array<{key: string, value: number}>
    name: string
    otherTerms: number
    prettyName: number
}
type RijksResponse = {
    elapsedMilliseconds: number,
    count: number,
    countFacets: { hasimage: number, ondisplay: number },
    artObjects: Array<RijksObjekt>
    facets: Array<RijksFacets>
}

describe("Museum data", () => {
    it("Rijksmuseum", (done) => {
        const apikey = process.env.RIJKS_API_KEY
        const url = new URL("https://www.rijksmuseum.nl/api/nl/collection")

        url.searchParams.append('key', apikey)
        url.searchParams.append('ps', '100') // default: 10
        url.searchParams.append('imgOnly', 'true') // default: 10
        url.searchParams.append('type', 'ketting') // Dutch for necklace

        // url.searchParams.append('involvedMaker', "Rembrandt van Rijn")

        let rawData: string = ''
        let parsedData: RijksResponse
        https.get(url.toString(), res => {
            const {statusCode} = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            }

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    console.error(e.message);
                }
                expect(rawData.length).toBeGreaterThan(0)
                expect(parsedData).not.toEqual({})
                const numFound = parsedData.artObjects.length
                console.debug(`Found ${numFound} items. One item:`)
                console.debug(parsedData.artObjects[1])
                done()
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        }).end();
    })

    it("British Museum", (done) => {
        const url = new URL("https://www.britishmuseum.org/collection/search")
            url.searchParams.append("keyword","ring")
            url.searchParams.append("material","silver")
            url.searchParams.append("image","true")
            url.searchParams.append("view","grid")
            url.searchParams.append("sort","object_name__asc")
            url.searchParams.append("page","1")
        let rawData: string = ''

        https.get(url.toString(), res => {
            const {statusCode} = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            }

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                console.log(rawData)
                dœone()
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        }).end();

    })
})
