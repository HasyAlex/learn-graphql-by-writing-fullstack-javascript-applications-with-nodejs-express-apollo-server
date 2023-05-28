import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from './db/jobs.js'
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql';
import { UnauthorizedError } from 'express-jwt';

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
        createJob: (_root, { input: {title, description}}, { user }) =>{
            if(!user) {
                throw unauthorizedError('Missing Authentication!')
            }
            const companyId = user.companyId;
            return createJob({ companyId, title , description})
        },
        deleteJob: async (_root, {id}, {user}) => {
            if(!user) {
                throw unauthorizedError('Missing authentication')
            }
            const job = await deleteJob(id, user.companyId)
            if(!job) {
                throw notFoundError(`No Job found with id :${id}`)                
            }
            return job
        },
        updateJob: async (_root, {id, title, description}, {user}) => {
            if(!user){
                throw unauthorizedError('Missing authentication')
            }
            const job = await updateJob({id, companyId: user.companyId, title, description})
            if(!job){
                throw notFoundError(`No Job found with id :${id}`)                
            }
            return job;
        }
    },

    //resolver function
    Job: {
        // company: (jobs) => getCompany(jobs.companyId)
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId);
        },

        //resolver function override the default values 
        date: (job) => toIsoDate(job.createdAt)
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

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions: {code: 'UNAUTHORIZED' }
    })
}