import React from 'react'

function Footer() {
  return (
    <div className=' border-t-3 p-3 font-bold font-mono text-lime-400 text-1xl flex justify-center fixed bottom-0 w-full '>
      © {new Date().getFullYear()} CodeCritic. All rights reserved.
    </div>
  )
}

export default Footer