import Parser, { ParserResponse } from './Parser'
import BrowserManager from '../browser/BrowserManager'
import Util from '../utils/Util'

class Semawur extends Parser {
    public marker = 'semawur.'

    constructor() {
        super()
    }

    async parse(link: string): Promise<ParserResponse> {
        const decodedLink = decodeURIComponent(link)
        const urlQuery = Util.getUrlQueryParam(decodedLink, 'url')

        if (urlQuery != null) {
            return {
                success: true,
                result: urlQuery.replace(/\++/g, ' ')
            }
        }

        const page = await BrowserManager.newPageWithNewContext()

        try {
            await page.goto(decodedLink)

            await page.waitForSelector('#link-view > button')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#link-view > button')
            ])
            await page.waitForSelector('a.get-link')
            await Util.sleep(5000)
            const downloadButton = await page.$('a.get-link')

            let classProp = await BrowserManager.getPlainProperty(downloadButton, 'className')
            do {
                await Util.sleep(5000)
                classProp = await BrowserManager.getPlainProperty(downloadButton, 'className')
            } while (classProp !== 'get-link')

            const downloadLinks = await BrowserManager.getPlainProperty<string>(downloadButton, 'href')

            await BrowserManager.closePageWithContext(page)
            
            return {
                success: true,
                result: downloadLinks
            }
        } catch (error) {
            await page.close()
            
            return {
                success: false,
                result: null,
                error: error
            }
        }
    }
}

export default Semawur
