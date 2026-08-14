import React from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { SquareTerminal } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'

function Navbar() {
  return (
    <div className='flex justify-between items-center p-3'>
      <div className='flex items-center gap-3'>
        <div className='bg-lime-300 text-black w-12 h-12 flex justify-center rounded-lg  items-center'>
          <SquareTerminal />
        </div>
        <div>
          <h1 className="text-3xl text-lime-300 font-semibold">CodeCritic</h1>
          <p className='flex'>Peer Code Review Platform</p>
        </div>
      </div >
      <div className='flex items-center gap-5' >
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton>
            <button className="bg-lime-300 hover:bg-lime-600 transition text-black rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
        <div className='scale-150'>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

export default Navbar
