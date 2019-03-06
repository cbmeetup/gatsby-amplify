import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { navigate } from 'gatsby'

import { WithAuthentication } from '../helpers/auth'

const PaddedDiv = styled.div`
  padding: 10px 15px;
`

export default () => (
  <WithAuthentication>
    {({ auth }) => {
      useEffect(() => {
        auth.handleAuthentication()
        navigate('/')
      }, [auth])

      return <PaddedDiv>Authenticating...</PaddedDiv>
    }}
  </WithAuthentication>
)
