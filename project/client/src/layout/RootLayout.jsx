import { Container } from '@mui/material'
import React from 'react'

export default function RootLayout({ children }) {
  return (
    <Container maxWidth={false}>{children}</Container>
  )
}
