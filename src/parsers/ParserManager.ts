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

interface IParsedOptions {
    ignoreCache?: boolean
    firstTime?: boolean
    oldData?: IParsedResponse
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
    async parse(link: string, options: IParsedOptions = { firstTime: true }): Promise<IParsedResponse> {
        // if using database, try getting the cached value first
        if (!options.ignoreCache && process.env.WITH_DATABASE === 'true') {
            const cachedShortlink = await this.getCachedShortlink(link)

            if (cachedShortlink) {
                console.info('\x1b[34m%s\x1b[0m', 'Parsed link found in cache. Returning the cached result.')

                return this.responseWithCached(cachedShortlink)
            }
        }

        console.info('\x1b[34m%s\x1b[0m', options.firstTime ? 'Parsing the link for the first time.' : 'Parsing the result link again.')

        // default result
        let result = options.firstTime ? {
            success: false,
            cached: false,
            original: link,
            parsed: null,
            error: 'Parser not found.',
        } : options.oldData

        // select the correct parser
        const parser = this.selectParser(link)
        
        if (!parser) {
            console.info('\x1b[34m%s\x1b[0m', 'No parser is found. Returning result with original link and success set to false.')

            return result
        }

        // parse the shortlink
        const parsed = await parser.parse(link)

        // cache the result if using database
        if (process.env.WITH_DATABASE === 'true' && parsed.success && parsed.result != null) {
            await this.cacheShortlink(link, parsed.result)
        }
        
        // update the result with the parsed data
        result = {
            success: parsed.success,
            cached: false,
            original: link,
            parsed: parsed.result,
            error: parsed.error,
        }
        
        // if successful and the result is not null, try parsing again
        if (parsed.success && parsed.result != null) {
            console.info('\x1b[34m%s\x1b[0m', 'The link has been parsed successfully. Attempting to parse the result link again.')

            result = await this.parse(result.parsed, {
                firstTime: false,
                oldData: result
            })
        }

        return result
    }
}

export default new ParserManager
