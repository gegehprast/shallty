const crypto = require('crypto')
const { sleep } = require('../utils/utils')

class Queue {
    constructor() {
        this.runningJobs = 0
    }

    register(task) {
        return {
            id: crypto.randomBytes(8).toString('hex'),
            task: task,
            result: undefined,
        }
    }

    async run(job) {
        if (this.runningJobs > 4) {
            return {
                finished: false
            }
        }
        
        this.runningJobs = this.runningJobs + 1
        
        const result = await job.task()

        this.runningJobs = this.runningJobs - 1

        return {
            finished: true,
            result: result,
        }
    }

    async dispatch(job) {
        let run = {
            finished: false
        }

        while (!run.finished) {
            await sleep(2000)
            
            run = await this.run(job)
        }

        return run.result
    }
}

module.exports = new Queue
