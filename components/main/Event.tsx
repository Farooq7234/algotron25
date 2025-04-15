import FlareCursor from "@/components/main/Cursor";
import Technical from './TechnicalCompetition';
import NonTechnical from './NonTechnicalCompetition';

function Events() {

  return (
    <div className='pt-20 w-full ' id='events'>
      <FlareCursor />
        <h1 className=' text-center text-7xl font-semibold Welcome-text text-transparent bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text font-mono '>Events</h1> 
        <Technical types="Technical Events" />
        <NonTechnical types="Non-Technical Events" />
      </div>
  )
}

export default Events
