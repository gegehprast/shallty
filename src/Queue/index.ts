import crypto from 'crypto'
import Util from '../utils/index'

type Task = (...args: any) => any

type Job = {
    id: string
    task: Task
    result: any
}

type RunningJob = {
    finished: boolean,
    result?: any,
}

class Queue {
    private runningJobs: number
    
    constructor() {
        this.runningJobs = 0
    }

    register(task: (...args: any) => any): Job {
        return {
            id: crypto.randomBytes(8).toString('hex'),
            task: task,
            result: undefined,
        }
    }

    async run(job: Job): Promise<RunningJob> {
        if (this.runningJobs > 4) {
            return {
                finished: false,
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

    async dispatch(job: Job) {
        let run: RunningJob = {
            finished: false
        }

        while (!run.finished) {
            await Util.sleep(2000)

            run = await this.run(job)
        }

        return run.result
    }
}

export default new Queue
