import fs from 'fs'
import path from 'path'
import Shortlink from '../Models/Shortlink'
import Parser, { ParserResponse } from './Parser'

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
    notFirstTime?: boolean
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
                file !== 'Parser.ts' &&
                file !== 'ParserManager.js' &&
                file !== 'ParserManager.ts' &&
                (file.endsWith('.js') || file.endsWith('.ts'))
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
     */
    async getCached(link: string): Promise<IParsedResponse|null> {
        const cached = await Shortlink.findOne({
            original: link
        })

        if (!cached) {
            return null
        }

        return {
            success: true,
            cached: true,
            id: cached._id,
            original: cached.original,
            parsed: cached.parsed,
            createdAt: cached.createdAt,
            updatedAt: cached.updatedAt,
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
     * Actually parse the link using the appropriate parser.
     * 
     */
    async parseResult(link: string): Promise<ParserResponse|null> {
        // select the correct parser
        const parser = this.selectParser(link)

        // no parser found, return null
        if (!parser) {
            console.info('\x1b[34m%s\x1b[0m', '[ParserManager] No parser is found.')

            return null
        }

        // parse the shortlink
        const parsed = await parser.parse(link)

        // cache the result if using database
        if (process.env.WITH_DATABASE === 'true' && parsed.success && parsed.result != null) {
            await this.cacheShortlink(link, parsed.result)
        }

        return parsed
    }

    /**
     * Parse the shortlink using the correct parser.
     *  
     */
    async parse(link: string, options: IParsedOptions = {}): Promise<IParsedResponse> {
        console.info('\x1b[34m%s\x1b[0m', '[ParserManager] ' + (options.notFirstTime ? '\nParsing the result link again. ' : '\nParsing the link for the first time. ') + link)

        // default result
        let result = options.notFirstTime ? options.oldData : {
            success: false,
            cached: false,
            original: link,
            parsed: null,
            error: 'Parser not found.',
        }
        let gotFromCache = false

        // if using database, try getting the cached value first
        if (!options.ignoreCache && process.env.WITH_DATABASE === 'true') {
            const cached = await this.getCached(link)

            // cached result exists, set the result
            if (cached != null) {
                console.info('\x1b[34m%s\x1b[0m', '[ParserManager] Parsed link found in cache. Using the cached result.')

                result = cached
                gotFromCache = true
            }
        }
        
        // skip this if already got result from cache
        if (!gotFromCache) {
            const parsed = await this.parseResult(link)

            if (parsed != null) {
                // update the result with the parsed data
                result = {
                    success: parsed.success,
                    cached: false,
                    original: link,
                    parsed: parsed.result,
                    error: parsed.error.toString(),
                }
            }
        }
        
        // if successful, and the result is not null, and is not the same as the link, try parsing again
        if (result.success && result.parsed != null && result.parsed != link) {
            console.info('\x1b[34m%s\x1b[0m', '[ParserManager] The link has been parsed successfully. Attempting to parse the result link again.')

            result = await this.parse(result.parsed, {
                ignoreCache: options.ignoreCache,
                notFirstTime: true,
                oldData: result,
            })
        } else {
            console.info('\x1b[34m%s\x1b[0m', '[ParserManager] Final result found.')
        }

        return result
    }
}

export default new ParserManager
