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
    <div className="flex w-full items-center gap-3 overflow-x-hidden p-3">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-300 text-black sm:size-12">
          <SquareTerminal className="size-5 sm:size-6" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-lime-300 sm:text-3xl">
            CodeCritic
          </h1>
          <p className="hidden sm:flex">Peer Code Review Platform</p>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-5">
        <div className="flex items-center gap-2 sm:gap-5">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap px-3 text-sm font-medium sm:h-10 sm:px-4">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-lime-300 px-3 text-sm font-medium text-black transition hover:bg-lime-600 sm:h-10 sm:px-4">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className='flex items-center gap-2'>
              <div
                className='flex items-center gap-1 rounded-full border border-lime-300/60 bg-lime-300/10 px-2 py-1 text-xs font-semibold text-lime-300'
                title='Karma points'
              >
                <Award size={14} />
                <span>{karma}</span>
                <span className='hidden sm:inline'>Karma</span>
              </div>
              <UserButton />
            </div>
          </Show>
        </div>
        <div className="scale-100 sm:scale-150">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

export default Navbar
