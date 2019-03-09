import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'
import gql from 'graphql-tag'
import auth from './auth'

export const client = new ApolloClient({
  uri: process.env.GATSBY_API_URL,
  fetch,
  fetchOptions: {
    credentials: 'include',
  },
  request: operation => {
    const token = auth.getIdToken()
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
      userId
      slug
      registeredAt
    }
  }
`

export const ATTEND_MEETUP_MUTATION = gql`
  mutation AttendMeetup($slug: ID!) {
    attendMeetup(slug: $slug) {
      userId
      slug
      registeredAt
    }
  }
`

export const CANCEL_ATTENDANCE_MUTATION = gql`
  mutation CancelAttendance($slug: ID!) {
    cancelAttendance(slug: $slug)
  }
`
