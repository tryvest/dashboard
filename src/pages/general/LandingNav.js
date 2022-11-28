import React from 'react';
import {TRYVESTOR} from "../../UserTypes";

function LandingNav(props) {
    return (
        <div
            data-collapse="medium"
            data-animation="default"
            data-duration="400"
            data-easing="ease"
            data-easing2="ease"
            // role="banner"
            className="nav-backing-2 w-nav"
        >
            <a href="/" aria-current="page" className="brand-box-2 w-nav-brand w--current" aria-label="home">
                <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285139e8ccaf7277393a6b9_unnamed.png"
                    width="117"
                    alt=""
                />
            </a>
            <div
                className="menu-button-2 w-nav-button"
                style={{ userSelect: 'text' }}
                aria-label="menu"
                role="button"
                tabIndex="0"
                aria-controls="w-nav-overlay-0"
                aria-haspopup="menu"
                aria-expanded="false"
            >
                <div className="w-icon-nav-menu" />
            </div>
            <nav role="navigation" className="nav-link-menu-2 w-nav-menu">
                {/* <a href="#how-it-works" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal"> */}
                {/*    How it Works */}
                {/* </a> */}
                {/*
            <a href="#founders" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
              About Our Founders
            </a>
            */}
                <a href="/discover" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
                    Discover Companies
                </a>
                <a href="/learn-more" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
                    How it Works
                </a>
                <a href="/legal" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
                    Legal Info
                </a>
                <a href={`/${TRYVESTOR}/login`} data-ix="show-modal" className="button-2 w-button">
                    Access Dashboard
                </a>
                {/*
<a href={`${BUSINESS}/login`} data-ix="show-modal" className="button-2 w-button">
              Business Login
            </a>
            */}
            </nav>
            <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0" />
        </div>
    );
}

export default LandingNav;