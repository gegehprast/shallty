import Parser, { ParserResponse } from './Parser'

class Google extends Parser {
    public marker = 'googleusercontent.com'

    constructor() {
        super()
    }

    async parse(link: string): Promise<ParserResponse> {
        // example link
        // https://doc-0c-08-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/
        // 2cccjbe7bppsau5f2r38rs2ni97jvtrd/1625818050000/14200466799599017451/*/1gUQZlJhXd5d4L6ZBo6JNrkTgrbEIqpiw?e=download

        const splitted = link.split('/*/')

        if (splitted.length > 1) {
            const splitted2 = splitted[splitted.length - 1].split('?e')

            if (splitted2.length > 0) {
                return {
                    success: true,
                    result: `https://drive.google.com/uc?id=${splitted2[0]}&export=download`
                }
            }
        }

        return {
            success: false,
            result: null,
            error: 'Link malformed or whatever.'
        }
    }
}

export default Google
