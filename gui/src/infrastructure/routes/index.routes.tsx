import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StableRoutes } from '../../app/modules/stable/routes/stable.routes'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <StableRoutes />
    </BrowserRouter>
  )
}

export { Routes }
