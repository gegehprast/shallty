export type ParserResponse = {
    success: boolean
    result: string|null
    error?: any
}

/**
 * Abstract Class Parser.
 *
 * @class Parser
 */
abstract class Parser {
    /**
     * Shortlink identifier. Used for selecting the correct parser on ParserManager.
     */
    public abstract marker: string

    /**
     * Will tell the ParserManager to not selecting this parser even when the identifier is matched.
     * For example when parsing a shortlink within a shortlink like: 
     * https://semawur.com/st/?api=5e700f432026525e3a40bc4df768475a560e73e9&url=https://drivemoe.com/?id=ZndqLzMxeVhTbXJCREtsREJmZ0NuRDgyR1VhZjRHajk2N3pMUzluM1ZJdWxRV1U5Z2FBTW9qS3ErL0R0dlF3U3VFYm5COXFuaDBsOVVkWG82NUQ4SkE9PQ==
     * 
     * Here the first  shortlink to parse is Semawur, not drivemoe. So in Drivemoe, `ignoreIfContains` should have Semawur `marker` in it.
     */
    public ignoreIfContains: string|null
    
    /**
     * Wheteher or not to expose to /parsers endpoint
     */
    public exposed = true

    /**
     * The parse method.
     * 
     * @param link
     */
    abstract parse(link: string): Promise<ParserResponse>
}

export default Parser
