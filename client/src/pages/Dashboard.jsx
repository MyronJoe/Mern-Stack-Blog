import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Dashsidebar from '../components/dashboard/Dashsidebar'
import DashProfile from '../components/dashboard/DashProfile'


export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState();

  //helps to search the url to get the current tab and update the tab state.
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromURL = urlParams.get('tab')

    if (tabFromURL) {
      setTab(tabFromURL)
    }
  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <div className="md:w-56">
        {/* sidebar */}
        <Dashsidebar />
      </div>

      <div className="">
        {/* profile and others */}

        {tab === 'profile' && <DashProfile />}

      </div>

    </div>
  )
}
