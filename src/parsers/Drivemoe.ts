import Parser, { ParserResponse } from './Parser'
import BrowserManager from '../browser/BrowserManager'

class Drivemoe extends Parser {
    public marker = 'drivemoe.'

    /** Anchor selector. */
    private $anchor = 'a[class="btn btn-primary moenime"]'

    constructor() {
        super()
    }

    async parse(link: string): Promise<ParserResponse> {
        const page = await BrowserManager.newOptimizedPage()
        
        try {
            link = decodeURIComponent(link)

            await page.goto(link)

            await page.waitForSelector(this.$anchor)

            const anchor = await page.$(this.$anchor)

            const url = await BrowserManager.getPlainProperty<string>(anchor, 'href')

            await page.close()

            return {
                success: true,
                result: url
            }
        } catch (error) {
            console.error(error)

            await page.close()

            return {
                success: false,
                result: null,
                error: error
            }
        }
    }
}

export default Drivemoe
