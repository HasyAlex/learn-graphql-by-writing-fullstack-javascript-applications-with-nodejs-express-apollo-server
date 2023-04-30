import {
	getAccessToken
} from '../auth'
import { ApolloClient, InMemoryCache, createHttpLink, gql, concat, ApolloLink } from '@apollo/client';


const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql'})
const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
    }
    return forward(operation)
})
export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
})


//Fragment-------------------------------------
const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        title
        date
        description
        company {
            id
            name
        }
    }
`
//Query---------------------------------------------
export const companyByIdQuery = gql`
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
export const jobByIdQuery = gql`
    query JobById($id: ID!){
        job(id: $id) {
           ...JobDetail
        }
    }
    ${jobDetailFragment}
    `

export const jobsQuery = gql`
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

export const createJobMutation = gql`
    mutation($input: CreateJobInput!){
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
    `
//---------------------------------------------

// export async function getJobs() {
// 	const query = gql`
//                     query Jobs {
//                         jobs {
//                             id
//                             date
//                             title
//                             description
//                                 company {
//                                     id
//                                     name 
//                                 }
//                             }
//                         }`

//     const result = await apolloClient.query({ query })
//     return result.data.jobs
// }

// export async function getJob(id) {
//     const {
//         data
//     } = await apolloClient.query({ query: jobByIdQuery, variables: {id} })
//     return data.job
// }

// export async function getCompanyById(id) {
//     const {
//         data
//     } = await apolloClient.query({
//         query: companyByIdQuery,
//         variables: { id }
//     })
//     return data.company
// }

// export async function createJob({
// 	title,
// 	description
// }) {
// 	const mutation = gql`
//     mutation($input: CreateJobInput!){
//         job: createJob(input: $input) {
//             ...JobDetail
//         }
//     }
//     ${jobDetailFragment}
//     `

//     const { data } = await apolloClient.mutate(
//         {
//             mutation,
//             variables: { 
//                 input: {
//                     title,
//                     description
//                 }
//             },
//             update: (cache, { data }) => {
//                 cache.writeQuery({
//                     query: jobByIdQuery,
//                     variables: { id: data.job.id },
//                     data
//                 })
//             }
//         }
//     )
//     return data.job
// }