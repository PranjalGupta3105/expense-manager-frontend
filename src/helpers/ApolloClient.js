import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat  } from '@apollo/client';
const apiUrl = import.meta.env.VITE_API_URL;

const httpLink = new HttpLink({ uri: `${apiUrl}/graph-ql` });

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