'use client';

import React, { useEffect, useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'
import { Award, SquareTerminal } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'
import { getUserKarma } from '@/lib/api'

function Navbar() {
  const { getToken, isSignedIn } = useAuth()
  const [karma, setKarma] = useState(0)

  useEffect(() => {
    if (!isSignedIn) {
      setKarma(0)
      return
    }

    let active = true

    async function loadKarma() {
      try {
        const token = await getToken()
        if (!token) return

        const user = await getUserKarma(token)
        if (active) setKarma(user.karma)
      } catch (error) {
        console.error('Karma fetch error:', error)
      }
    }

    loadKarma()

    return () => {
      active = false
    }
  }, [getToken, isSignedIn])

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
          <div className='flex items-center gap-2'>
            <div
              className='flex items-center gap-1 rounded-full border border-lime-300/60 bg-lime-300/10 px-2.5 py-1 text-sm font-semibold text-lime-300'
              title='Karma points'
            >
              <Award size={16} aria-hidden='true' />
              <span>{karma}</span>
              <span className='hidden sm:inline'>Karma</span>
            </div>
            <UserButton />
          </div>
        </Show>
        <div className='scale-150'>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

export default Navbar
