import {
	getAccessToken
} from '../auth'
import { ApolloClient, InMemoryCache, createHttpLink, gql, concat, ApolloLink } from '@apollo/client';

// import {
// 	GraphQLClient	
// } from 'graphql-request'

///==============================================================================//
// const client = new GraphQLClient('http://localhost:9000/graphql', {
// 	headers: () => {
// 		const accessToken = getAccessToken();
// 		if (accessToken) {
// 			return {
// 				'Authorization': `Bearer ${accessToken}`
// 			}
// 		}
// 		return {};
// 	}
// })

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
const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
})
///==============================================================================//


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
//---------------------------------------------


const jobByIdQuery = gql`
    query JobById($id: ID!){
        job(id: $id) {
           ...JobDetail
        }
    }
    ${jobDetailFragment}
    `

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

	// const {
	// 	jobs
	// } = await client.request(query)
	// return jobs;

    const result = await apolloClient.query({ query })
    return result.data.jobs
}

export async function getJob(id) {
	// const {
	// 	job
	// } = await client.request(query, {
	// 	id
	// })
	// return job
    const {
        data
    } = await apolloClient.query({ query: jobByIdQuery, variables: {id} })
    return data.job
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

	// const { 
	// 	company
	// } = await client.request(query, {
	// 	id
	// })
	// return company

    const {
        data
    } = await apolloClient.query({
        query,
        variables: { id }
    })
    return data.company
}

export async function createJob({
	title,
	description
}) {
	const mutation = gql`
    mutation($input: CreateJobInput!){
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
    `
	// const data = await client.request(mutation, {
	// 	input: {
	// 		title,
	// 		description
	// 	}
	// })
	// return data.job;
    const { data } = await apolloClient.mutate(
        {
            mutation,
            variables: { 
                input: {
                    title,
                    description
                }
            },
            update: (cache, { data }) => {
                cache.writeQuery({
                    query: jobByIdQuery,
                    variables: { id: data.job.id },
                    data
                })
            }
        }
    )
    return data.job
}