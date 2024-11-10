import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat  } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://localhost:3030/graph-ql' });
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJwaG9uZSI6Ijg4NjAxODc2NDIiLCJpYXQiOjE3MjkzMjE5MzV9.4xEOre2WpkmZaNDJEYJTrnaR3qiDfHp3GpgcFx-LOgg';

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