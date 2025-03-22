import { Fragment } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import Container from '@mui/material/Container'
import { Paper } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
      <Container component="main" maxWidth="xl" sx={{ mb: 4, pt: 10 }}>
        <Paper elevation={3} sx={{ my: { xs: 1, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography variant="h3" gutterBottom>
            Error
          </Typography>
          <Typography variant="h5" noWrap gutterBottom>
            <RootBoundary />
          </Typography>
        </Paper>
      </Container>
  )
}

function RootBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <Fragment>
          Page not found!
        </Fragment>
      )
    }

    if (error.status === 401) {
      return (
        <Fragment>
          No permission to access this page!
        </Fragment>
      )
    }

    if (error.status === 503) {
      return (
        <Fragment>
            Service unavailable!
        </Fragment>
      )
    }

    if (error.status === 418) {
      return <Fragment>🫖</Fragment>
    }
  }

  return <Fragment>{error.statusText || error.message}</Fragment>
}