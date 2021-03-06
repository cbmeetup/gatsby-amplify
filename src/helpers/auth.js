import auth0 from 'auth0-js'
import jwtDecode from 'jwt-decode'
import { navigate } from 'gatsby'
import {
  isSupported,
  CookieStorage,
  MemoryStorage,
} from 'local-storage-fallback'

class Auth {
  storage = null
  auth0 = new auth0.WebAuth({
    domain: 'leonrodenburg.eu.auth0.com',
    audience: process.env.GATSBY_AUTH0_AUDIENCE,
    clientID: 'HNB4povCl5Sxy3Ci9ZNiHhLlV5uCvKBx',
    redirectUri: process.env.GATSBY_AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile',
  })

  constructor() {
    if (isSupported('localStorage')) {
      this.storage = window.localStorage
    } else if (isSupported('cookieStorage')) {
      this.storage = new CookieStorage()
    } else {
      this.storage = new MemoryStorage()
    }

    this.scheduleTokenRefresh()
  }

  login() {
    this.storage.setItem('loginRedirect', window.location.pathname)
    this.auth0.authorize()
  }

  handleAuthentication() {
    const loginRedirect = this.storage.getItem('loginRedirect')
    this.storage.removeItem('loginRedirect')

    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken) {
        this.setSession(authResult)
        navigate(loginRedirect ? loginRedirect : '/', { replace: true })
      } else if (err) {
        console.log(err)
        navigate(loginRedirect ? loginRedirect : '/', { replace: true })
      }
    })
  }

  getIdToken() {
    return this.storage.getItem('idToken')
  }

  getProfile() {
    const idToken = jwtDecode(this.getIdToken())
    return {
      id: idToken.sub,
      name: idToken.name,
      firstName: idToken.given_name,
      lastName: idToken.family_name,
      picture: idToken.picture,
    }
  }

  setSession(authResult) {
    this.storage.setItem('isLoggedIn', 'true')

    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    this.storage.setItem('expiresAt', expiresAt)
    this.storage.setItem('idToken', authResult.idToken)

    this.scheduleTokenRefresh()
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        console.log(err)
        this.logout()
      }
    })
  }

  logout() {
    this.storage.removeItem('idToken')
    this.storage.removeItem('expiresAt')
    this.storage.removeItem('isLoggedIn')

    clearTimeout(this.tokenRenewalTimeout)

    window.location.reload()
  }

  isAuthenticated() {
    const isLoggedIn = this.storage.getItem('isLoggedIn')
    const expiresAt = this.storage.getItem('expiresAt')
    return isLoggedIn === 'true' && Date.now() < expiresAt
  }

  scheduleTokenRefresh() {
    const expiresAt = this.storage.getItem('expiresAt')
    if (!expiresAt) return

    const timeout = expiresAt - Date.now()
    if (this.tokenRenewalTimeout) window.clearInterval(this.tokenRenewalTimeout)
    this.tokenRenewalTimeout = setTimeout(
      () => {
        this.renewSession()
      },
      timeout > 0 ? timeout : 0,
    )
  }
}

const auth = new Auth()

export const WithAuthentication = ({ children }) => {
  if (typeof children !== 'function')
    throw new Error(
      'Authentication component should receive a single render function as a child',
    )

  return children({ auth })
}

export default auth
