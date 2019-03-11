import React from 'react'
import { graphql } from 'gatsby'
import { Query, Mutation } from 'react-apollo'
import moment from 'moment'
import classNames from 'classnames'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { WithAuthentication } from '../helpers/auth'
import {
  GET_ATTENDANCE_QUERY,
  CANCEL_ATTENDANCE_MUTATION,
  ATTEND_MEETUP_MUTATION,
} from '../helpers/apollo'

const ColoredIconButton = ({ buttonClass, iconClass, onClick, children }) => {
  const buttonClasses = classNames('button', buttonClass)
  const iconClasses = classNames('fas', iconClass)
  return (
    <button className={buttonClasses} onClick={onClick}>
      <span className="icon">
        <i className={iconClasses} />
      </span>
      &nbsp; {children}
    </button>
  )
}

const AttendMeetupButton = ({ isAttending, slug }) => (
  <>
    {isAttending && (
      <Mutation
        mutation={CANCEL_ATTENDANCE_MUTATION}
        refetchQueries={() => ['GetAttendance']}
      >
        {cancelAttendance => (
          <>
            <ColoredIconButton
              buttonClass="is-danger"
              iconClass="fa-times"
              onClick={() =>
                cancelAttendance({
                  variables: {
                    slug,
                  },
                })
              }
            >
              Cancel attendance
            </ColoredIconButton>
          </>
        )}
      </Mutation>
    )}
    {!isAttending && (
      <Mutation
        mutation={ATTEND_MEETUP_MUTATION}
        refetchQueries={() => ['GetAttendance']}
      >
        {attendMeetup => (
          <ColoredIconButton
            buttonClass="is-primary"
            iconClass="fa-check"
            onClick={() =>
              attendMeetup({
                variables: {
                  slug,
                },
              })
            }
          >
            Attend this meetup
          </ColoredIconButton>
        )}
      </Mutation>
    )}
  </>
)

const Event = ({ data: { markdownRemark: event } }) => (
  <Layout>
    <SEO title={event.frontmatter.title} />
    <main className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <h1 className="title">{event.frontmatter.title}</h1>
            <p className="subtitle">
              {moment(event.frontmatter.date).format('LLLL')}
            </p>
            <div className="content">
              <div dangerouslySetInnerHTML={{ __html: event.html }} />
            </div>
          </div>
          <div className="column">
            <div className="box">
              <h2 className="subtitle">Your attendance</h2>
              <p>
                Let us know whether or not you are attending this meetup:
                <br />
                <br />
                <WithAuthentication>
                  {({ auth }) => (
                    <>
                      {auth.isAuthenticated() && (
                        <Query
                          query={GET_ATTENDANCE_QUERY}
                          skip={!auth.isAuthenticated()}
                          variables={{ slug: event.fields.slug }}
                        >
                          {({ loading, error, data }) => {
                            if (loading) return null
                            if (error) {
                              return (
                                <span className="has-text-danger">
                                  Oops! Something went wrong...
                                </span>
                              )
                            }

                            return (
                              <AttendMeetupButton
                                isAttending={data.getAttendance !== null}
                                slug={event.fields.slug}
                              />
                            )
                          }}
                        </Query>
                      )}
                      {!auth.isAuthenticated() && (
                        <span>You need to log in to attend this meetup.</span>
                      )}
                    </>
                  )}
                </WithAuthentication>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </Layout>
)

export default Event

export const query = graphql`
  query EventBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        date
      }
    }
  }
`
