import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat  } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://localhost:3030/graph-ql' });
let token = localStorage.getItem("token");

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    }
  }));

  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: concat(authMiddleware, httpLink),
});

export default client;