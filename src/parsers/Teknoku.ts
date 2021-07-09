import Parser from './Parser'
import BrowserManager from '../browser/BrowserManager'

class Teknoku extends Parser {
    public marker = 'teknoku'

    constructor() {
        super()
    }

    async parse(link: string): Promise<string|null> {
        const page = await BrowserManager.newOptimizedPage()

        try {
            link = decodeURIComponent(link)

            await page.goto(link)

            await Promise.all([
                page.waitForNavigation({
                    waitUntil: 'domcontentloaded'
                }),

                page.$eval('#srl > form', (form: HTMLFormElement) => {
                    form.submit()
                }),
            ])

            const fullContent = await page.content()
            await page.close()

            // eslint-disable-next-line quotes
            let splitted = fullContent.split("function changeLink(){var a='")
            splitted = splitted[1].split(';window.open')
            const finalUrl = splitted[0].replace(/(['"])+/g, '')

            return finalUrl
        } catch (error) {
            console.error(error)

            await page.close()
        }

        return null
    }
}

export default Teknoku