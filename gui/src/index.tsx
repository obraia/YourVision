import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './infrastructure/redux/store'
import App from './App'

const container = document.getElementById('root')

window.addEventListener('resize', (e) => {
 if(!container) return
  container.style.height = `${window.innerHeight}px`
})

createRoot(container!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
