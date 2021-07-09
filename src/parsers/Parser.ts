/**
 * Abstract Class Parser.
 *
 * @class Parser
 */
abstract class Parser {
    public abstract marker: string

    abstract parse(link: string): Promise<string|null>
}

export default Parser
