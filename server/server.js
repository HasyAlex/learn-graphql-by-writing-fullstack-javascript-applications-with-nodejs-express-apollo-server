import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { readFile } from 'node:fs/promises'
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4'

import { resolvers } from './resolvers.js'
import { getUser } from './db/users.js';


const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf8')

async function getContext({ req }) {
  console.log(`[getContext] req.body: ${JSON. stringify(req.body)}`)
  console.log(`[getContext] req.auth: ${JSON. stringify(req.auth)}`)
  if(req.auth){
    const user = await getUser(req.auth.sub)
    return { user }
  }
  return { }
} 

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, {context: getContext}))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}!`);
});
