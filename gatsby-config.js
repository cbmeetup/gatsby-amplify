module.exports = {
  siteMetadata: {
    title: 'AWS User Group',
    description:
      'Statically rendered frontend for AWS User Group event website.',
    author: 'Léon Rodenburg & Martijn van Dongen',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/events/`,
        name: 'events',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/images/`,
        name: 'images',
      },
    },
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              showLineNumbers: true,
            },
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        ignore: [
          'prismjs/themes/prism.css',
          'prismjs/plugins/line-numbers/prism-line-numbers.css',
        ],
      },
    },
  ],
}
