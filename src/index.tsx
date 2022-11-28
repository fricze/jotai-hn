import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './App'
import AppRedux from './AppRedux'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
      {/* <App/> */}
      <AppRedux />
  </StrictMode>,
  rootElement
)
