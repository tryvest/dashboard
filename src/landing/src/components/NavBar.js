import React from "react"
export default function Navbar() {
    return (
    <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="nav-backing-2 w-nav">
        <a href="/" aria-current="page" className="brand-box-2 w-nav-brand w--current" aria-label="home">
            <img src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285139e8ccaf7277393a6b9_unnamed.png" width="117" alt=""></img>
        </a>
        <div className="menu-button-2 w-nav-button"  aria-label="menu" role="button" tabIndex="0" aria-controls="w-nav-overlay-0" aria-haspopup="menu" aria-expanded="false">
            <div className="w-icon-nav-menu">
            </div>
        </div>
        <nav role="navigation" className="nav-link-menu-2 w-nav-menu">
            <a href="#how-it-works" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">How it Works</a>
            <a href="#process" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">About Our Founders</a>
            <a href="/frequently-asked-questions" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">FAQ</a><a href="/forbusiness" className="nav-link-2 whitenav fjwifbwifj w-nav-link" data-ix="show-modal">For Business</a>
            <a href="https://airtable.com/shrzqWIQnLBz5ujd4" data-ix="show-modal" className="button-2 fveudbrie w-button">Join User Waitlist</a>
        </nav>
        <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
    )
}