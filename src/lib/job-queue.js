const {priority} = require('../modules/jobs/jobs.contants')

const rank = {
    [priority.HIGH]: 0,
    [priority.MEDIUM]: 1,
    [priority.LOW]: 2,
}

function createJobQueue(run, interval) {
    const jobs = [];

    let busy = false;

    const timer = setInterval(async () => {
       if(busy || jobs.length === 0){
        return
       } 
       busy = true

       jobs.sort((a,b)=> rank[a.priority] - rank[b.priority]);

       await run(jobs.shift());

       busy = false
    }, interval);

    timer.unref();

    return {
        push: (job) => jobs.push(job),
        stop: () => clearInterval(timer)
    }
}

module.exports = {createJobQueue};

