import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return <Container maxWidth={false}><Outlet /></Container>
}
