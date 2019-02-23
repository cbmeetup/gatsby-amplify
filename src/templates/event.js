import React from 'react'
import { graphql } from 'gatsby'
import moment from 'moment'

import Layout from '../components/layout'
import SEO from '../components/seo'

export default ({ data }) => {
  const event = data.markdownRemark
  return (
    <Layout>
      <SEO title={event.frontmatter.title} />
      <main className="section">
        <div className="container">
          <h1 className="title">{event.frontmatter.title}</h1>
          <p className="subtitle">
            {moment(event.frontmatter.date).format('LLLL')}
          </p>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: event.html }} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query EventBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
      }
    }
  }
`
