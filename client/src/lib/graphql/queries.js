import { GraphQLClient, gql } from 'graphql-request'

const client =  new GraphQLClient('http://localhost:9000/graphql')

export async function getJobs() {
    const query = gql`
                    query Jobs {
                        jobs {
                            id
                            date
                            title
                            description
                                company {
                                    id
                                    name 
                                }
                            }
                        }`

    const { jobs } = await client.request(query)
    return jobs;  
}

export async function getJob(id) {
    const query = gql`
    query JobById($id: ID!){
        job(id: $id) {
            id
            title
            date
            description
            company {
                id
                name
                description
            }
        }
    }`

    const { job } = await client.request(query, {id})
    return job
}

export async function getCompanyById(id) {
    const query = gql`
    query getCompanyById($id: ID!){
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                title
                description
                date
            }
        }
    }`

    const { company } = await client.request(query, {id})
    return company
}

export async function createJob({title, description}){
    const mutation = gql`
    mutation($input: CreateJobInput!){
        job: createJob(input: $input) {
            id
        }
    }
    `
    const data = await client.request(mutation, {
        input: { title, description }
    })
    return data.job;
}
