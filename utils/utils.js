class Util {
    /**
     * Array.forEach but blocking.
     * @param array array to iterate.
     * @param callback callback function to call for every iteration. 
     */
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    /**
     * Sleep.
     * @param ms sleep time on milliseconds.
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Get all query parameter from a url
     * @param url url 
     */
    getAllUrlParams(url) {
        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1)

        // we'll store the parameters here
        let obj = {}

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0]

            // split our query string into its component parts
            let arr = queryString.split('&')

            for (let i = 0; i < arr.length; i++) {
                // separate the keys and the values
                let a = arr[i].split('=')

                // set parameter name and value (use 'true' if empty)
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]

                // (optional) keep case consistent
                paramName = paramName.toLowerCase()
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    let key = paramName.replace(/\[(\d+)?\]/, '')
                    if (!obj[key]) obj[key] = []

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        let index = /\[(\d+)\]/.exec(paramName)[1]
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
}

module.exports = new Util