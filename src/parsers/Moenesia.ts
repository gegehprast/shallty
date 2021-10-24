import Parser, { ParserResponse } from './Parser'
import BrowserManager from '../browser/BrowserManager'
import Util from '../utils/Util'

class Moenesia extends Parser {
    public marker = 'moenesia.'

    constructor() {
        super()
    }

    async parse(link: string): Promise<ParserResponse> {
        const page = await BrowserManager.newOptimizedPage()

        try {
            link = decodeURIComponent(link)

            await page.goto(link)

            await page.waitForNavigation({
                waitUntil: 'domcontentloaded'
            })

            // submit the landing form
            await page.$eval('form#landing', (form: HTMLFormElement) => {
                form.submit()
            })

            // wait for 10 s just in case
            await Util.sleep(10000)

            // wait for showlink
            await page.waitForSelector('#showlink')

            // select showlink
            const showlinkButton = await page.$('#showlink')

            // click showlink
            await showlinkButton.click()

            // get new page from the new tab that just opened by clicking showlinkButton
            const newPage = await BrowserManager.getPageFromNewTab(page)

            const finalUrl = newPage.url()

            await newPage.close()

            await page.close()

            return {
                success: true,
                result: finalUrl
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

export default Moenesia
