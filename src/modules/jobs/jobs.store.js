//Inmemory job store
function createJobStore() {
    const jobs = new Map();

    return {
        save(job) {
            jobs.set(job.id, job);

            return job
        },
        findById(id) {
            return jobs.get(id) ?? null;
        },
        findByStatus(status){
            return [...jobs.values()].filter((s)=> s.status === status)
        }
    }
}

module.exports = {createJobStore}