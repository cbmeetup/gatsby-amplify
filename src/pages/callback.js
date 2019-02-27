import React from 'react'
import styled from '@emotion/styled'
import { navigate } from 'gatsby'

import auth from '../helpers/auth'

const PaddedDiv = styled.div`
  padding: 10px 15px;
`

export default class extends React.Component {
  componentDidMount() {
    auth.handleAuthentication()
    navigate('/')
  }

  render() {
    return <PaddedDiv>Authenticating...</PaddedDiv>
  }
}
