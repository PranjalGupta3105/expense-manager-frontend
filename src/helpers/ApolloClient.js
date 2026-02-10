import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat  } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://localhost:3030/graph-ql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // Always get the latest token for each request
  const token = localStorage.getItem("token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }));
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: concat(authMiddleware, httpLink),
});

export default client;