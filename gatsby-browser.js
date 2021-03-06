import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { client } from './src/helpers/apollo'

import 'bulma/css/bulma.css'
import 'prismjs/themes/prism.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import '@fortawesome/fontawesome-free/js/all'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
