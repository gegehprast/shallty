import Parser, { ParserResponse } from './Parser'
import BrowserManager from '../browser/BrowserManager'

class Drivemoe extends Parser {
    public marker = 'drivemoe.'

    public ignoreIfContains = 'semawur.'

    /** Anchor selector. */
    private $anchor = 'a[class="btn btn-default convert"]'

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

            await anchor.click()

            await page.waitForNavigation({
                waitUntil: 'domcontentloaded'
            })

            // probably google drive url
            const url = page.url()
            
            await page.close()

            return {
                success: true,
                result: url
            }
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', error)

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
