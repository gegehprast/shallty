import Parser, { ParserResponse } from './Parser'

class Google extends Parser {
    public marker = 'drive.google.com'

    constructor() {
        super()
    }

    async parse(link: string): Promise<ParserResponse> {
        return {
            success: true,
            result: link
        }
    }
}

export default Google
