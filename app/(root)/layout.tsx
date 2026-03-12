import React from 'react'
import Header from '@/components/Header'
import CinematicFooter from '@/components/CinematicFooter'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Header />
        {children}
        <CinematicFooter />
    </div>
  )
}

export default layout