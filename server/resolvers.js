import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from './db/jobs.js'
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, {id}) => {
           const job = await getJob(id);
           if(!job){
            throw notFoundError(`No Job found with id :${id}`)                
           }
           return job;
        },
        company: async (_root, {id}) => {
          const company = await getCompany(id);
          if(!company){
            throw notFoundError(`No Company found with id :${id}`)                
          }
          return company;
        }
    },

    Mutation: {
        createJob: (_root, { input: {title, description}}) =>{
            const companyId = "FjcJCHJALA4i";
            return createJob({ companyId, title , description})
        },
        deleteJob: (_root, {id}) => {
            return deleteJob(id)
        },
        updateJob: (_root, {id, title, description}) => {
            return updateJob({id, title, description})
        }
    },

    //resolver function
    Job: {
        //resolver function override the default values 
        date: (job) => toIsoDate(job.createdAt),
        company: (jobs) => getCompany(jobs.companyId)
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: {code: 'NOT_FOUND' }
    })
}