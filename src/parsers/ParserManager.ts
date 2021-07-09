import fs from 'fs'
import path from 'path'
import Shortlink, { IShortlink } from '../Models/Shortlink'
import Parser from './Parser'

interface IParsedResponse {
    success: boolean
    cached: boolean
    original: string
    parsed: string | null
    id?: string
    createdAt?: Date
    updatedAt?: Date
    error?: any
}

class ParserManager {
    private parsers: (new () => Parser)[] = []

    constructor() {
        this.readFiles()
    }

    /**
     * Read parser files.
     * 
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
        await Shortlink.findOneAndUpdate(
            {
                original: originalLink
            }, {
                original: originalLink,
                parsed: parsedLink
            }, {
                upsert: true,
                setDefaultsOnInsert: true
            }
        )
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
    responseWithCached(cachedShortlink: IShortlink): IParsedResponse {
        return {
            success: true,
            cached: true,
            id: cachedShortlink._id,
            original: cachedShortlink.original,
            parsed: cachedShortlink.parsed,
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
            // init the parser
            const parser = new item

            // check the marker(s)
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

    /**
     * Parse the shortlink using the correct parser.
     *  
     */
    async parse(link: string, forceNew = false): Promise<IParsedResponse> {
        // if using database, try getting the cached value first
        if (!forceNew && process.env.WITH_DATABASE === 'true') {
            const cachedShortlink = await this.getCachedShortlink(link)

            if (cachedShortlink) {
                return this.responseWithCached(cachedShortlink)
            }
        }

        // select the correct parser
        const shorterner = this.selectParser(link)

        // parse the shortlink
        const parse = await shorterner.parse(link)
        
        // cache the result if using database
        if (process.env.WITH_DATABASE === 'true' && parse.success && parse.result != null) {
            await this.cacheShortlink(link, parse.result)
        }

        return {
            success: parse.success,
            cached: false,
            original: link,
            parsed: parse.result,
            error: parse.error,
        }
    }
}

export default new ParserManager
