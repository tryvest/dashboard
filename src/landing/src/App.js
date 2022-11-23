import React, {useEffect} from "react"
import Footer from "./components/Footer.js"
import HowItWorks, {HowItWorksHeader, HowItWorksDashboard, HowItWorksDiscover, HowItWorksPortfolio} from "./components/HowItWorks.js"
import MeetTheFounder from "./components/MeetTheFounder.js"
import NavBar from "./components/NavBar.js"
import SectionHead from "./components/SectionHead.js"
import React from "react"
import NavBar from "./components/NavBar.js"
import Footer from "./components/Footer.js"
import FounderSection from "./components/FounderSection"
import BusinessNavbar from "./components/business/BusinessNavBar.js"
import BusinessSectionHead from "./components/business/BusinessSectionHead.js"
import { BusinessHowItWorks, BusinessHowItWorksHeader } from "./components/business/BusinessHowItWorks.js"
import BusinessFAQ from "./components/business/BusinessFAQ.js"

export default function App() {
    useEffect(()=>{
        window.Webflow && window.Webflow.destroy();
        window.Webflow && window.Webflow.ready();
        window.Webflow && window.Webflow.require('ix2').init();
        document.dispatchEvent(new Event('readystatechange'))
      })

    return (
        <div>
            <NavBar />
            <div class="div-block-7">
                <SectionHead />
                <HowItWorks />
                <MeetTheFounder />
            </div>
            <Footer />
        </div>
    )
}

export function Founder() {
    return (
        <div>
            <NavBar />
            <FounderSection />
            <Footer />
        </div>
    )
}

export function BusinessLanding() {
    return (
        <div>
            <BusinessNavbar />
            <div className="div-block-7">
                <BusinessSectionHead />
                <BusinessHowItWorksHeader />
                <BusinessHowItWorks />
            </div>
            <div id="process" className="section process wf-section">
                <img src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg" alt="yellow blob 2" width="600" className="image-14 process _2" />
                <BusinessFAQ />
                <MeetTheFounder />
                <img src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg" alt="yellow blob shape" width="700" className="image-13 process hero-shape-1" />
            </div>
            <Footer />
        </div>
    )
}