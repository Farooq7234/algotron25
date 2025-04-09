<<<<<<< HEAD

=======
// import Competition from '@/components/main/CulturalCompetition'
import Events from '@/components/main/Event'
import Footer from '@/components/main/Footer'
import Navbar from '@/components/main/Navbar'
import StarsCanvas from '@/components/main/StarCanvas'
>>>>>>> 504b2f667cedce06829513e61812b1646ef59dba
import Technical from '@/components/main/TechnicalCompetition'
import React from 'react'

function page() {
  return (
    <div className="flex flex-col h-[950px] gap-20 bg-contain bg-fixed">
      {/* <StarsCanvas/> */}
      <Technical types='Technical Fest'/>
    </div>
  )
}

export default page