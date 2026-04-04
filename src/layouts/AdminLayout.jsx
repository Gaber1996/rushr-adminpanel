import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#FEFEFE]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
