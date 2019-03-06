import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Query } from 'react-apollo'
import moment from 'moment'
import classNames from 'classnames'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { withAuth } from '../helpers/auth'
import { GET_ATTENDANCE_QUERY } from '../helpers/apollo'

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

class Event extends React.Component {
  attendMeetup(slug) {
    console.log(slug, this.client)
  }

  render() {
    const { data, auth } = this.props
    const event = data.markdownRemark
    return (
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
                    {!auth.isAuthenticated() &&
                      'You need to log in to attend this meetup.'}
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

                        if (auth.isAuthenticated()) {
                          if (data && data.getAttendance != null) {
                            return (
                              <ColoredIconButton
                                buttonClass="is-danger"
                                iconClass="fa-times"
                                onClick={() => console.log('Unattending')}
                              >
                                Cancel attendance
                              </ColoredIconButton>
                            )
                          } else {
                            return (
                              <ColoredIconButton
                                buttonClass="is-primary"
                                iconClass="fa-check"
                                onClick={() => console.log('Attending')}
                              >
                                Attend this meetup
                              </ColoredIconButton>
                            )
                          }
                        } else {
                          return null
                        }
                      }}
                    </Query>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    )
  }
}

Event.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

export default withAuth(Event)

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
