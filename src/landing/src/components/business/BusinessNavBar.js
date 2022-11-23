import React from "react"
export default function BusinessNavbar() {
    return (
    <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="nav-backing-2 w-nav">
        <a href="/" className="brand-box-2 w-nav-brand" aria-label="home">
            <img src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285139e8ccaf7277393a6b9_unnamed.png" width="117" alt="" />
        </a>
        <div classNameName="menu-button-2 w-nav-button" style="-webkit-user-select: text;" aria-label="menu" role="button" tabindex="0" aria-controls="w-nav-overlay-0" aria-haspopup="menu" aria-expanded="false">
            <div className="w-icon-nav-menu"></div>
        </div>
        <nav role="navigation" className="nav-link-menu-2 w-nav-menu"><a href="#how-it-works" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">How It Works</a><a href="#faq" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">FAQ</a><a href="#mtf" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">Meet the Founders</a><a href="/forbusiness" aria-current="page" className="nav-link-2 whitenav w-nav-link w--current" data-ix="show-modal">For Business</a><a href="https://airtable.com/shrTxWeRwlAxyBwQ2" data-ix="show-modal" className="button-2 w-button">Join Company Waitlist</a></nav>
        <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
    )
}