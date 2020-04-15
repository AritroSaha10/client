import React, { useState, Fragment, useEffect } from "react"
import { navigate } from "@reach/router"
import { setUser, isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { Button, Box, Grid, Text } from "@chakra-ui/core"
import loginIllustration from "../images/loginIllustration.svg"
import { Desktop, Mobile, IsMobile, IsDesktop } from "../utils/mediaQueries"
import SEO from "./seo"
import { pageView } from "../utils/ga"

const Login = () => {

  const [authLoading, setAuthLoading] = useState(false)
  var googleAuth = null

  useEffect(() => {
    pageView("Login")
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      'login_hint': '000000@pdsb.net',
      'hd': "pdsb.net" // only takes users with the GSuite domain of pdsb.net
    })

    if (isLoggedIn()) {
      navigate('/app/candidates')
    }
  

    googleAuth = () => {
      setAuthLoading(true)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
          firebase.auth().signInWithPopup(provider).then(res => {
            setUser(res.user)
            try {
              firebase.analytics().logEvent('login')
            } catch(e) {
              console.warn("Analytics blocked")
            }
            navigate('/app/candidates')
          }).catch(err => {
            setAuthLoading(false)
            console.warn("Something went wrong with authentication: " + err)
          })
      })
    }
  })
    

  const LoginSection = () => {
    return (
      <Box 
        display="flex" 
        justifyContent="space-between" 
        flexDirection="column" 
        px={IsMobile() ? "5vw" : 0} py={IsMobile() ? "12vh" : "24vh"} 
        h="100vh" 
        textAlign="center"
      >
        <SEO title="Login"/>
        <Box>
          <Text fontWeight="bold" color="blueGray.900" fontSize={IsMobile() ? "3xl" : "4xl"}>Fraser Votes</Text>
          <Text fontWeight="600" color="blueGray.600" fontSize={IsMobile() ? "md" : "lg"}>Student Activity Council Elections 2020</Text>
        </Box>
        <Mobile>
          <Box 
            backgroundPosition="center center" 
            backgroundRepeat="no-repeat"  
            backgroundSize="contain"
            backgroundImage={`url("${loginIllustration}")`} 
            height="100%"
            my="6.5vh"
          />
        </Mobile>
        <Box>
          <Button isLoading={authLoading} size="lg" py="16px" px="92px" borderRadius="12px" onClick={() => {googleAuth()}} variantColor="primary">
            Continue
          </Button>
          <Text letterSpacing="normal" color="blueGray.600" marginTop="12px" fontSize="sm">Please log in using your pdsb.net email</Text>
        </Box>
      </Box>
    )
  }

  return (
    <Fragment>
      <Desktop>
        <Grid gridTemplateColumns="8fr 6fr" gridTemplateRows="1fr"> 
          <Box 
            backgroundPosition="center center" 
            backgroundRepeat="no-repeat" 
            backgroundSize="65%" 
            backgroundImage={`url("${loginIllustration}")`} 
            backgroundColor="primary.500" 
            h="100vh"
          />
          <LoginSection/>
        </Grid>
      </Desktop>
      <Mobile>
        <LoginSection/>
      </Mobile>
    </Fragment>
  )
}

export default Login
