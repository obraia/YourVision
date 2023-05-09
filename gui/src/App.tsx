import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { AppRoutes } from './infrastructure/routes/index.routes'
import { GlobalStyle } from './infrastructure/styles/global'
import { RootState } from './infrastructure/redux/store'

const App: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.theme)

  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        <GlobalStyle />
        <AppRoutes />
      </Fragment>
    </ThemeProvider>
  )
}

export default App
