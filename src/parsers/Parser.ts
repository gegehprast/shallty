/**
 * Abstract Class Parser.
 *
 * @class Parser
 */
class Parser {
    public marker: string

    constructor() {
        if (this.constructor == Parser) {
            throw new Error('Abstract classes can\'t be instantiated.')
        }
    }

    async parse(link: string): Promise<string|null> {
        return link
    }
}

export default Parser
