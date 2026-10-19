const { randomUUID } = require('crypto')
const logger = require('../../logger');
const {jobstatus, priority} = require('../jobs/jobs.contants')
const {createJobQueue} = require('../../lib/job-queue');
const { stat } = require('fs');

function jobService({store, worker, interval}) {
    async function run(job) {
        job.status = jobstatus.PROCESSING

        try {
            await worker(job);
            job.status = jobstatus.COMPLETED
        } catch (error) {
            job.status = jobstatus.FAILED
            logger.error(`JOB FAILED: ${job.id}`);
        }
    }

    const queue = createJobQueue({run,interval});

    return {
        create(type, payload){
            const job = store.save({id: randomUUID(), type, payload, status: jobstatus.QUEUED});
            if(priority === priority.HIGH){
                run(job)
            }else {
                queue.push(job)
            }

            return {id: job.Id, status: job.status}
        }
    }
}