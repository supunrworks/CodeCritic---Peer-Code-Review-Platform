import React from 'react'
import { SquareTerminal } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'

function Navbar() {
  return (
    <div className='flex font-serif justify-between items-center p-3'>
      <div className='flex items-center gap-3'>
        <div className='bg-orange-600 text-black  w-12 h-12 flex justify-center rounded-lg  items-center'>
          <SquareTerminal />
        </div>
        <div>
          <h1 className="text-3xl text-orange-600 font-semibold">CodeCritic</h1>
          <p className='flex'>Peer Code Review Platform</p>
        </div>
      </div >
      <div className='scale-150 '>
        <ModeToggle />

      </div>
    </div>
  )
}

export default Navbar