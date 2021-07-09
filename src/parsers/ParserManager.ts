import fs from 'fs'
import path from 'path'
import Shortlink, { IShortlink } from '../Models/Shortlink'
import Queue from '../Queue'
import Parser from './Parser'

interface IShortlinkResponse {
    success: boolean
    cached: boolean
    original: string
    url: string | null
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

class ParserManager {
    private WITH_DATABASE: boolean
    private parsers: (new () => Parser)[] = []

    constructor() {
        this.WITH_DATABASE = process.env.WITH_DATABASE === 'true'

        this.readFiles()
    }

    /**
     * Read parser files.
     */
    readFiles() {
        const parserFiles = fs.readdirSync(path.join(__dirname, './'))
            .filter(file => file !== 'Parser.js' && 
                file !== 'ParserManager.js' && 
                file.endsWith('.js')
            )
        const parsers: any[] = []

        for (const file of parserFiles) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            parsers.push((require(`./${file}`)).default)
        }

        this.parsers = parsers
    }

    /**
     * Save new parsed shortlink to the database.
     * 
     */
    async cacheShortlink(originalLink: string, parsedLink: string) {
        const newParsed = new Shortlink({
            original: originalLink,
            parsed: parsedLink
        })

        await newParsed.save()
    }

    /**
     * Get parsed shortlink by the original link from the database.
     * 
     * @param {string} link 
     */
    async getCachedShortlink(link: string) {
        return await Shortlink.findOne({
            original: link
        })
    }

    /**
     * Response with the cached shortlink.
     * 
     */
    responseWithCached(cachedShortlink: IShortlink): IShortlinkResponse {
        return {
            success: true,
            cached: true,
            id: cachedShortlink._id,
            original: cachedShortlink.original,
            url: cachedShortlink.parsed,
            createdAt: cachedShortlink.createdAt,
            updatedAt: cachedShortlink.updatedAt,
        }
    }

    /**
     * Select the correct parser for the link.
     * 
     * @param {string} link
     */
    selectParser(link: string): Parser {
        let selected = null

        for (const item of this.parsers) {
            const parser = new item

            if (Array.isArray(parser.marker)) {
                for (const marker of parser.marker) {
                    if (link.includes(marker)) {
                        selected = parser
                        break
                    }
                }

                if (selected) {
                    break
                }
            } else {
                if (link.includes(parser.marker)) {
                    selected = parser
                    break
                }
            }
        }

        return selected
    }

    async parse(link: string, queue = false): Promise<IShortlinkResponse> {
        if (this.WITH_DATABASE) {
            const cachedShortlink = await this.getCachedShortlink(link)

            if (cachedShortlink) {
                return this.responseWithCached(cachedShortlink)
            }
        }

        let parsed
        const shorterner = this.selectParser(link)

        if (queue) {
            const job = Queue.register(async () => {
                return await shorterner.parse(link)
            })

            parsed = await Queue.dispatch(job)
        } else {
            parsed = await shorterner.parse(link)
        }
        
        if (this.WITH_DATABASE && parsed != null) {
            await this.cacheShortlink(link, parsed)
        }

        return {
            success: parsed != null,
            cached: false,
            original: link,
            url: parsed
        }
    }
}

export default new ParserManager
