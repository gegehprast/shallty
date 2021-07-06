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
     * Get all query parameter from a url
     * 
     */
    getAllUrlParams(url: string, toLowerCase = false) {
        let queryString = url.split('?')[1]
        const obj: any = {}

        if (queryString) {
            queryString = queryString.split('#')[0]
            const arr = queryString.split('&')

            for (let i = 0; i < arr.length; i++) {
                const a = arr[i].split('=') // separate the keys (param name) and the values (param value)
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]

                if (toLowerCase) {
                    paramName = paramName.toLowerCase()
                    if (typeof paramValue === 'string')
                        paramValue = paramValue.toLowerCase()
                }

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {
                    // create key if it doesn't exist
                    const key = paramName.replace(/\[(\d+)?\]/, '')
                    if (!obj[key])
                        obj[key] = []

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        const index = /\[(\d+)\]/.exec(paramName)[1]
                        obj[key][index] = paramValue
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue)
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]]
                        obj[paramName].push(paramValue)
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue)
                    }
                }
            }
        }

        return obj
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
