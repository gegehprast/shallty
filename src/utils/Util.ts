class Util {
    /**
     * Check if something is undefined.
     * 
     * @param variable Something to check.
     */
    isUndefined(variable: any) {
        return typeof variable === 'undefined'
    }

    /**
     * Check if an array/object is empty.
     * 
     * @param item Object/array to check.
     */
    isEmpty(item: Record<string, unknown> | any[]) {
        if (Array.isArray(item)) {
            return item.length < 1
        }

        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key))
                return false
        }

        return true
    }

    /**
     * Array.forEach but blocking.
     * 
     * @param array Array to iterate.
     * @param callback Callback function to call for every iteration.
     */
    async asyncForEach(array: any[], callback: (value: any, index: number, array: any[]) => Promise<void>) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    /**
     * Sleep.
     * 
     * @param ms sleep time on milliseconds.
     */
    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Decode base64 encoded string
     * 
     */
    base64Decode(string: string) {
        const buff = Buffer.from(string, 'base64')

        return buff.toString('ascii')
    }

    /**
     * Get a query parameter from a url string.
     * 
     */
    getUrlQueryParam(url_string: string, param: string) {
        const url = new URL(url_string)

        return url.searchParams.get(param)
    }

    /**
     * Generate random alphanumeric string
     * 
     * @param length String length
     */
    randomString(length: number) {
        let result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        return result
    }

    /**
     * Upper case the first letter of a string.
     * 
     */
    ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
}

export default new Util
