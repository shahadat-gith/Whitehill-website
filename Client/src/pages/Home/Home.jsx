import React from 'react'
import Hero from './Components/Hero/Hero'
import Stats from './Components/Stats/Stats'
import WhyInvest from './Components/WhyInvest/WhyInvest'
import FeaturedOpportunities from './Components/FeaturedOpportunities/FeaturedOpportunities'



const Home = () => {
  return (
    <div>
       <Hero/>
       <Stats/>
       <WhyInvest/>
       <FeaturedOpportunities/>
    </div>
  )
}

export default Home