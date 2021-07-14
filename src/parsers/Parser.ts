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
    public abstract marker: string
    
    public exposed = true

    abstract parse(link: string): Promise<ParserResponse>
}

export default Parser
