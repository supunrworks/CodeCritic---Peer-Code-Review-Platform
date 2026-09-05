import React from 'react'

function Footer() {
  return (
    <div className="border-t-3 bg-background p-3 font-bold font-mono text-lime-400 flex justify-center fixed bottom-0 z-10 w-full">
      © {new Date().getFullYear()} CodeCritic. All rights reserved.
    </div>
  )
}

export default Footer