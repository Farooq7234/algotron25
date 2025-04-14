import Navbar from '@/components/main/Navbar'
import NonTechnical from '@/components/main/NonTechnicalCompetition';
// import StarsCanvas from '@/components/main/StarCanvas'
import React from 'react'

function page() {
  
  return (
    <div className='overflow-x-hidden' >
      {/* <StarsCanvas/> */}
      <NonTechnical types='Non Technical Fest'/>
      <Navbar/>
    </div>
  )
}

export default page