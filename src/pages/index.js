import React from 'react'
import { graphql, Link } from 'gatsby'
import moment from 'moment'

import Layout from '../components/layout'
import SEO from '../components/seo'

export const ViewMeetupButton = ({ to, title }) => (
  <p
    css={{
      marginTop: '2em',
    }}
  >
    <Link to={to} className="button is-primary">
      {title}
    </Link>
  </p>
)

export default ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <section className="hero is-medium is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Welcome</h1>
          <h2 className="subtitle">
            Welcome to the AWS User Group website! We will publish all our
            exciting events here.
          </h2>
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <div className="tile is-ancestor">
          {data.allMarkdownRemark.edges.map(edge => (
            <div className="tile is-parent" key={edge.node.fields.slug}>
              <div className="tile is-child notification is-light">
                <p className="title is-5">{edge.node.frontmatter.title}</p>
                <p className="subtitle is-6">
                  {moment(edge.node.frontmatter.date).format('LLLL')}
                </p>
                <p>{edge.node.excerpt}</p>
                <ViewMeetupButton
                  to={edge.node.fields.slug}
                  title="View meetup"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
)

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
          }
          excerpt
        }
      }
    }
  }
`
