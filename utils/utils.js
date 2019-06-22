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
}

module.exports = new Util