import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'
import gql from 'graphql-tag'
import Auth from './auth'

export const client = new ApolloClient({
  uri: process.env.GATSBY_API_URL,
  fetch,
  fetchOptions: {
    credentials: 'include',
  },
  request: operation => {
    const token = new Auth().getIdToken()
    operation.setContext({
      headers: {
        authorization: token,
      },
    })
  },
})

export const GET_ATTENDANCE_QUERY = gql`
  query GetAttendance($slug: ID!) {
    getAttendance(slug: $slug) {
      slug
      userId
    }
  }
`
