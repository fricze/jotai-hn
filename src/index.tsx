import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './App'
import AppRedux from './AppRedux'
import AppHooks from './AppHooks'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
      {/* <App/> */}
      {/* <AppRedux /> */}
      <AppHooks />
  </StrictMode>,
  rootElement
)
