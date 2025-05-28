import react from 'react'
import Navbar from './home/Navbar'
import Home from './home/Home'
import Travel from './travel/Travel'
import LiveData from './hotspots/LiveData'
import FutureHotspots from './hotspots/FutureHotspot'
import Links from './home/Links'
import './index.css'

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <Links />
      <Travel />
      <LiveData />
      <FutureHotspots />
    </>
  )
}

export default App
