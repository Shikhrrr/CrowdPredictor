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
      <div id="#home">
        <Home />
      </div>
      <Links />
      <div id="live-data">
        <LiveData />
      </div>
      <div id="travel">
        <Travel />
      </div>
      <div id="future-hotspots">
        <FutureHotspots />
      </div>
    </>
  )
}

export default App
