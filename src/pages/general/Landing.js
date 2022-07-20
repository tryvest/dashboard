import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AppBar, Backdrop, CircularProgress, Container, Link, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Page from '../../components/Page';
import './landing.css';
import {BUSINESS, TRYVESTOR} from "../../UserTypes";

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  overflowY: 'scroll',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  overflow: 'scroll',
  padding: theme.spacing(12, 0),
}));

export function Landing() {
  const navigate = useNavigate();

  return (
    <Page title="Landing">
      <div>
        <div
          data-collapse="medium"
          data-animation="default"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
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
            <a href="#how-it-works" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
              How it Works
            </a>
            <a href="#founders" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
              About Our Founders
            </a>
            <a href={`${TRYVESTOR}/login`} data-ix="show-modal" className="button-2 w-button">
              Tryvestor Login
            </a>
            <a href={`${BUSINESS}/login`} data-ix="show-modal" className="button-2 w-button">
              Business Login
            </a>
          </nav>
          <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0" />
        </div>
        <div>
          <div className="hero-2 wf-section">
            <div className="hero-div-holder-2">
              <div className="content-holder">
                <h1 className="white-heading-2 hero-holder">
                  Building better
                  <span className="smaller-head fwf">
                    <br />
                    launch communities
                  </span>
                </h1>
                <p className="body-paragraphy-2 light hero-subhead">
                  Create network effects, get feedback, and de-risk your customer acquisition cost.
                </p>
                <a href="https://airtable.com/shrTxWeRwlAxyBwQ2" className="cta-button-2 w-button">
                  Join Waitlist
                </a>
              </div>
              <div className="right-img-area w-clearfix">
                <img
                  src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285296c07bf5c12c7bc7dae_people-tile-tryvest-head-2.png"
                  alt="showing contact cards and social icons"
                  className="hero-image-right"
                />
              </div>
            </div>
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg"
              alt="yellow blob shape"
              className="image-13 process hero-shape-1"
            />
          </div>
          <div id="how-it-works" className="how-it-works wf-section">
            <div className="section-body-div hiw">
              <div className="how-it-works div">
                <h3 className="text udesly-typewriter">
                  Get users through a <br />
                  low-risk, low-effort, <span className="text-span">low-cost</span> system
                </h3>
              </div>
              <div className="right-steps hiw" />
            </div>
          </div>
          <div id="how-it-works" className="how-it-works wf-section">
            <div className="section-body-div hiw">
              <div className="how-it-works div">
                <div className="subhead-2 v3 hiw">HOW&nbsp;IT&nbsp;WORKS</div>
                <h3 className="text thinner less-space">
                  <strong>With Tryvest...</strong>
                </h3>
              </div>
              <div className="right-steps hiw">
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a268a086e66aef27af8e58_Button%20style-amico.svg"
                    loading="lazy"
                    width="234"
                    alt=""
                    className="image-18"
                  />
                  <div className="number _2">1</div>
                  <div className="hiw-head">Users find your company and express interest</div>
                  <p className="hiw-para">
                    Through your website, users can be incentivized to join with equity rewards
                  </p>
                </div>
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a269b553db6ee7eb7142fa_Mobile%20inbox-amico.svg"
                    loading="lazy"
                    width="235"
                    alt=""
                    className="image-20"
                  />
                  <div className="number _2">2</div>
                  <div className="hiw-head">Users join Tryvest and complete terms</div>
                  <p className="hiw-para">Keep tabs on your Tryvestors and seamlessly communicate with them</p>
                </div>
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a2693e426a4853fdf3ee33_Refer%20a%20friend-amico.svg"
                    loading="lazy"
                    width="235"
                    alt=""
                    className="image-19"
                  />
                  <div className="number _2">3</div>
                  <div className="hiw-head">Users receive phantom equity and join launch community</div>
                  <p className="hiw-para">Phantom equity is off your cap table, so you retain ownership</p>
                </div>
              </div>
              <a href="https://airtable.com/shrTxWeRwlAxyBwQ2" className="cta-button-2 middle w-button">
                Join Waitlist
              </a>
            </div>
          </div>
          <div id="founders" className="section process wf-section">
            <div className="section-body-div">
              <div className="right-steps" />
            </div>
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg"
              alt="yellow blob 2"
              width="700"
              className="image-14 process _2"
            />
            <div className="thanks-div-2">
              <img
                src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6299869f94ea0f2216e5e1c9_kaushikandbrett.svg"
                loading="lazy"
                width="350"
                height="350"
                alt=""
                className="image-16"
              />
              <div className="div-block bjnrtibet">
                <h2 className="title-header thanks ibfnoibneob">
                  Meet Brett and Kaushik
                  <br />
                  <span className="smaller-head">
                    Read about the story behind Tryvest and find out where we are going.
                    <br />{' '}
                  </span>
                </h2>
                <a href="/founder" className="cta-button-2 middle rgwg w-button">
                  Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section wf-section">
          <div className="columns w-row">
            <div className="column-4 w-col w-col-3 w-col-stack">
              <div className="copyright-text-2">Copyright © 2022,&nbsp;tryvest.us</div>
            </div>
            <div className="column-5 w-clearfix w-col w-col-9 w-col-stack">
              <div className="footer-div-2 right">
                <a href="mailto:brett@tryvest.us" className="footer-link-2">
                  Contact
                </a>
                <a href="/privacy-policy" className="footer-link-2">
                  Privacy
                </a>
                <a href="https://www.instagram.com/tryvestus/?hl=en" className="social-img w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628730ba2f392d1f39778b5e_87390.png"
                    width="25"
                    alt=""
                  />
                </a>
                <a href="https://www.linkedin.com/company/tryvest/?viewAsMember=true" className="w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628734418cfe41537abdd5bd_download__3_-removebg-preview.png"
                    loading="lazy"
                    width="24"
                    alt=""
                    className="image-15"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=62851205cdcbe027038914be"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />
        <script
          src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/js/webflow.2484c7b6c.js"
          type="text/javascript"
        />
      </div>
    </Page>
  );
}

export function Founders() {
  return (
    <Page title="Founders">
      <Container>
        <div
          data-collapse="medium"
          data-animation="default"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
          className="nav-backing-2 w-nav"
        >
          <a href="/" className="brand-box-2 w-nav-brand" aria-label="home">
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285139e8ccaf7277393a6b9_unnamed.png"
              width="113"
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
          <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0" />
        </div>
        <div className="hero-2 inner thanks wf-section">
          <div className="hero-div-holder-2 inner thanks">
            <div className="thanks-div-2 yrntrnr">
              <div className="div-block">
                <div className="div-block-5">
                  <div className="div-block-3">
                    <img
                      src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/629410b72508d8c9b8271700_1652668755325.jpeg"
                      loading="lazy"
                      width="200"
                      height="200"
                      alt=""
                      className="image-16 fgedfv"
                    />
                    <div className="text-block">
                      <strong className="bold-text-3">
                        Brett Seaton
                        <br />
                      </strong>
                      Co-founder of Tryvest
                    </div>
                  </div>
                  <div className="div-block-6">
                    <h2 className="title-header thanks jdfhvd">
                      <strong>How We Got Started</strong>
                      <span className="fgbrtbt">
                        <br />
                      </span>
                    </h2>
                    <h2 className="title-header thanks jdfhvd erhg">
                      <span className="smaller-head">
                        Hey, I'm Brett! Last fall I started as a freshman in the Wharton School at the University of
                        Pennsylvania. Arriving on campus for the first time, I joined an environment where people were
                        launching social media apps, finance apps, wellness apps — you name it. Everyone marketed their
                        apps the same way: usually with free fast food in exchange for downloading the app. <br />
                        <br />I loved other people’s launch day because I could get some free cookies and chicken
                        sandwiches. Most people — including myself — would stroll up to the booth, download the app, and
                        eat the free food. By the time I finished eating, I would have uninstalled the app and continued
                        with my day. Or, it would sit on my phone untouched because there was no long-term incentive for
                        me to engage with the app.
                        <br />
                        <br />
                        This experience reflects many issues I had faced during my time at Column, a startup that sells
                        software to newspapers. In Fall 2020, I went on a sales road trip with the goal of convincing
                        newspapers to adopt our software. It wasn’t successful. Newspapers worried that the incentives
                        weren’t strong enough to be an adopter. They viewed our pitch as a risky tradeoff — the
                        possibility of a more efficient system in exchange for being a guinea pig. I chalked this sales
                        trip up to a loss and refocused on the few newspapers who had taken that leap of faith with us.
                        <br />
                        <br />
                        After many failed sales trips like mine, enough newspapers were willing to be guinea pigs that
                        our system grew. Two years later, Column has signed agreements with many U.S. states and
                        respected organizations like the Washington Post. Did Column’s value proposition really improve
                        that much in two years? Did the platform become substantially more useful? No and no. <br />
                        <br />
                        There have certainly been improvements to the system, but that’s not the main reason for
                        Column’s success. By continually incorporating feedback from their early adopters, Column built
                        an effective network and cultivated trust with their initial adopters and other newspapers.
                        <br />
                        <br />
                        This isn’t a success story. Rather, Column’s story is a cautionary tale that even powerful
                        systems and talented teams face enormous initial adoption headwinds. However, upon strong
                        network effects being established, good products succeed.
                        <br />‍<br />
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="div-block-5">
                  <div className="div-block-3">
                    <img
                      src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62992fa29a562a8a31dda45c_1653274555632.jpeg"
                      loading="lazy"
                      width="200"
                      height="200"
                      alt=""
                      className="image-16 fgedfv ytnny"
                    />
                    <div className="text-block gertgetg">
                      <strong>
                        Kaushik Akula
                        <br />‍
                      </strong>
                      Co-founder of Tryvest
                    </div>
                  </div>
                  <div>
                    <h2 className="title-header thanks jdfhvd erhg rgerg">
                      <span className="smaller-head">
                        My co-founder, Kaushik, experienced similar difficulties in initial product adoption. While
                        working at a few startups and going to startup conferences, Kaushik noticed firsthand many ideas
                        with potential but no community to help them launch. Without advocates pushing ideas in the
                        right direction and adopting the product when it becomes valuable, startups have almost no
                        chance at success.
                        <br />
                        <br />
                        The power of obtaining explorers’ loyalty is unrealized. Kaushik is someone who our product is
                        built for: he is an initial adopter. He loves keeping up with the latest developments and
                        getting his hands on the newest innovations. Oftentimes explorers like Kaushik try products,
                        give feedback, and are at the front lines of helping the company succeed… all to be unrecognized
                        and unrewarded for their support.
                        <br />
                        <br />
                        First adopters provide huge value to startups—they identify small changes that would improve the
                        product and provide crucial network effects. Sadly, explorers remain poorly incentivized and are
                        often treated just like any other user. &nbsp;So, they move on quickly from product to product.
                        <br />
                        <br />
                        In January, Brett and Kaushik got together to start working on a solution. Our goal is to create
                        an incentive for adopters that commits them to the company for the long term instead of one-off
                        incentives like free chicken sandwiches.
                        <br />
                        <br />
                        By speaking to Penn startups and to explorers (people looking for exciting new technology), we
                        heard that founders echoed our concerns with the chicken sandwich incentive. <br />
                        <br />
                        But the most compelling part of our research was that explorers felt disconnected from the
                        people whose products they were downloading, engaging with, and asked for feedback on.{' '}
                        <em>Both</em> sides wanted a deeper, longer-term connection — they just weren’t really sure how
                        to structure it.
                        <br />
                        <br />
                        Explorers consistently parroted the same sentiment that came to define our solution: “I wish
                        [the startup] treated me like part of the company.” That really struck us. <br />
                        <br />
                        We didn’t realize how intertwined these first users felt with the company until they often
                        compared themselves to the company’s employees. So we thought, why not provide compensation the
                        same way that the best employees are at early startups — with ownership of the company?
                        <br />‍<br />
                        We are building a platform to do just that — make users feel like owners and help startups
                        create long-term engagement. This is a substantial problem and an audacious solution. We are
                        still malleable, continually improving our system to make companies and users more comfortable
                        with our incentive structure. <br />
                        <br />
                        We are taking the time to build this product the right way because, with Tryvest, we have the
                        vision of turning yesterday’s stakeholders into tomorrow's shareholders and yesterday’s scrapped
                        apps into tomorrow’s unicorns. We hope you’ll help us build and launch communities!
                        <br />
                      </span>
                    </h2>
                  </div>
                </div>
                <img
                  src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6299921123f33e745feeb70d_tryvestteamcollage.svg"
                  loading="lazy"
                  alt=""
                  className="image-17"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section wf-section">
          <div className="columns w-row">
            <div className="column-4 w-col w-col-3 w-col-stack">
              <div className="copyright-text-2">Copyright © 2022,&nbsp;tryvest.us</div>
            </div>
            <div className="column-5 w-clearfix w-col w-col-9 w-col-stack">
              <div className="footer-div-2 right">
                <a href="mailto:brett@tryvest.us" className="footer-link-2">
                  Contact
                </a>
                <a href="/privacy-policy" className="footer-link-2">
                  Privacy
                </a>
                <a href="https://www.instagram.com/tryvestus/?hl=en" className="social-img w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628730ba2f392d1f39778b5e_87390.png"
                    width="25"
                    alt=""
                  />
                </a>
                <a href="https://www.linkedin.com/company/tryvest/?viewAsMember=true" className="w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628734418cfe41537abdd5bd_download__3_-removebg-preview.png"
                    loading="lazy"
                    width="24"
                    alt=""
                    className="image-15"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=62851205cdcbe027038914be"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />
        <script
          src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/js/webflow.f176041ef.js"
          type="text/javascript"
        />
      </Container>
    </Page>
  );
}

/*
<div
          data-collapse="medium"
          data-animation="default"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
          className="nav-backing-2 w-nav"
        >
          <a href="/" className="brand-box-2 w-nav-brand" aria-label="home">
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285139e8ccaf7277393a6b9_unnamed.png"
              width="113"
              alt=""
            />
          </a>
          <div
            className="menu-button-2 w-nav-button"
            style={{userSelect: "text"}}
            aria-label="menu"
            role="button"
            tabIndex="0"
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <div className="w-icon-nav-menu"/>
          </div>
          <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"/>
        </div>
        <div className="hero-2 inner thanks wf-section">
          <div className="hero-div-holder-2 inner thanks">
            <div className="thanks-div-2 yrntrnr">
              <div className="div-block">
                <div className="div-block-5">
                  <div className="div-block-3">
                    <img
                      src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/629410b72508d8c9b8271700_1652668755325.jpeg"
                      loading="lazy"
                      width="200"
                      height="200"
                      alt=""
                      className="image-16 fgedfv"
                    />
                    <div className="text-block">
                      <strong className="bold-text-3">
                        Brett Seaton
                        <br />
                      </strong>
                      Co-founder of Tryvest
                    </div>
                  </div>
                  <div className="div-block-6">
                    <h2 className="title-header thanks jdfhvd">
                      <strong>How We Got Started</strong>
                      <span className="fgbrtbt">
                        <br />
                      </span>
                    </h2>
                    <h2 className="title-header thanks jdfhvd erhg">
                      <span className="smaller-head">
                        Hey, I'm Brett! Last fall I started as a freshman in the Wharton School at the University of
                        Pennsylvania. Arriving on campus for the first time, I joined an environment where people were
                        launching social media apps, finance apps, wellness apps — you name it. Everyone marketed their
                        apps the same way: usually with free fast food in exchange for downloading the app. <br />
                        <br />I loved other people’s launch day because I could get some free cookies and chicken
                        sandwiches. Most people — including myself — would stroll up to the booth, download the app, and
                        eat the free food. By the time I finished eating, I would have uninstalled the app and continued
                        with my day. Or, it would sit on my phone untouched because there was no long-term incentive for
                        me to engage with the app.
                        <br />
                        <br />
                        This experience reflects many issues I had faced during my time at Column, a startup that sells
                        software to newspapers. In Fall 2020, I went on a sales road trip with the goal of convincing
                        newspapers to adopt our software. It wasn’t successful. Newspapers worried that the incentives
                        weren’t strong enough to be an adopter. They viewed our pitch as a risky tradeoff — the
                        possibility of a more efficient system in exchange for being a guinea pig. I chalked this sales
                        trip up to a loss and refocused on the few newspapers who had taken that leap of faith with us.
                        <br />
                        <br />
                        After many failed sales trips like mine, enough newspapers were willing to be guinea pigs that
                        our system grew. Two years later, Column has signed agreements with many U.S. states and
                        respected organizations like the Washington Post. Did Column’s value proposition really improve
                        that much in two years? Did the platform become substantially more useful? No and no. <br />
                        <br />
                        There have certainly been improvements to the system, but that’s not the main reason for
                        Column’s success. By continually incorporating feedback from their early adopters, Column built
                        an effective network and cultivated trust with their initial adopters and other newspapers.
                        <br />
                        <br />
                        This isn’t a success story. Rather, Column’s story is a cautionary tale that even powerful
                        systems and talented teams face enormous initial adoption headwinds. However, upon strong
                        network effects being established, good products succeed.
                        <br />‍<br />
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="div-block-5">
                  <div className="div-block-3">
                    <img
                      src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62992fa29a562a8a31dda45c_1653274555632.jpeg"
                      loading="lazy"
                      width="200"
                      height="200"
                      alt=""
                      className="image-16 fgedfv ytnny"
                    />
                    <div className="text-block gertgetg">
                      <strong>
                        Kaushik Akula
                        <br />‍
                      </strong>
                      Co-founder of Tryvest
                    </div>
                  </div>
                  <div>
                    <h2 className="title-header thanks jdfhvd erhg rgerg">
                      <span className="smaller-head">
                        My co-founder, Kaushik, experienced similar difficulties in initial product adoption. While
                        working at a few startups and going to startup conferences, Kaushik noticed firsthand many ideas
                        with potential but no community to help them launch. Without advocates pushing ideas in the
                        right direction and adopting the product when it becomes valuable, startups have almost no
                        chance at success.
                        <br />
                        <br />
                        The power of obtaining explorers’ loyalty is unrealized. Kaushik is someone who our product is
                        built for: he is an initial adopter. He loves keeping up with the latest developments and
                        getting his hands on the newest innovations. Oftentimes explorers like Kaushik try products,
                        give feedback, and are at the front lines of helping the company succeed… all to be unrecognized
                        and unrewarded for their support.
                        <br />
                        <br />
                        First adopters provide huge value to startups—they identify small changes that would improve the
                        product and provide crucial network effects. Sadly, explorers remain poorly incentivized and are
                        often treated just like any other user. &nbsp;So, they move on quickly from product to product.
                        <br />
                        <br />
                        In January, Brett and Kaushik got together to start working on a solution. Our goal is to create
                        an incentive for adopters that commits them to the company for the long term instead of one-off
                        incentives like free chicken sandwiches.
                        <br />
                        <br />
                        By speaking to Penn startups and to explorers (people looking for exciting new technology), we
                        heard that founders echoed our concerns with the chicken sandwich incentive. <br />
                        <br />
                        But the most compelling part of our research was that explorers felt disconnected from the
                        people whose products they were downloading, engaging with, and asked for feedback on.{' '}
                        <em>Both</em> sides wanted a deeper, longer-term connection — they just weren’t really sure how
                        to structure it.
                        <br />
                        <br />
                        Explorers consistently parroted the same sentiment that came to define our solution: “I wish
                        [the startup] treated me like part of the company.” That really struck us. <br />
                        <br />
                        We didn’t realize how intertwined these first users felt with the company until they often
                        compared themselves to the company’s employees. So we thought, why not provide compensation the
                        same way that the best employees are at early startups — with ownership of the company?
                        <br />‍<br />
                        We are building a platform to do just that — make users feel like owners and help startups
                        create long-term engagement. This is a substantial problem and an audacious solution. We are
                        still malleable, continually improving our system to make companies and users more comfortable
                        with our incentive structure. <br />
                        <br />
                        We are taking the time to build this product the right way because, with Tryvest, we have the
                        vision of turning yesterday’s stakeholders into tomorrow's shareholders and yesterday’s scrapped
                        apps into tomorrow’s unicorns. We hope you’ll help us build and launch communities!
                        <br />
                      </span>
                    </h2>
                  </div>
                </div>
                <img
                  src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6299921123f33e745feeb70d_tryvestteamcollage.svg"
                  loading="lazy"
                  alt=""
                  className="image-17"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section wf-section">
          <div className="columns w-row">
            <div className="column-4 w-col w-col-3 w-col-stack">
              <div className="copyright-text-2">Copyright © 2022,&nbsp;tryvest.us</div>
            </div>
            <div className="column-5 w-clearfix w-col w-col-9 w-col-stack">
              <div className="footer-div-2 right">
                <a href="mailto:brett@tryvest.us" className="footer-link-2">
                  Contact
                </a>
                <a href="/privacy-policy" className="footer-link-2">
                  Privacy
                </a>
                <a
                  href="https://www.instagram.com/tryvestus/?hl=en"
                  className="social-img w-inline-block"
                >
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628730ba2f392d1f39778b5e_87390.png"
                    width="25"
                    alt=""
                  />
                </a>
                <a href="https://www.linkedin.com/company/tryvest/?viewAsMember=true" className="w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628734418cfe41537abdd5bd_download__3_-removebg-preview.png"
                    loading="lazy"
                    width="24"
                    alt=""
                    className="image-15"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=62851205cdcbe027038914be"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />
        <script
          src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/js/webflow.f176041ef.js"
          type="text/javascript"
        />
 */

/*
<div
          data-collapse="medium"
          data-animation="default"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
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
            style={{userSelect: "text"}}
            aria-label="menu"
            role="button"
            tabIndex="0"
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <div className="w-icon-nav-menu"/>
          </div>
          <nav role="navigation" className="nav-link-menu-2 w-nav-menu">
            <a href="#how-it-works" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
              How it Works
            </a>
            <a href="#process" className="nav-link-2 whitenav w-nav-link" data-ix="show-modal">
              About Our Founders
            </a>
            <a href="https://airtable.com/shrTxWeRwlAxyBwQ2" data-ix="show-modal" className="button-2 w-button">
              Join Waitlist
            </a>
          </nav>
          <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"/>
        </div>
        <div>
          <div className="hero-2 wf-section">
            <div className="hero-div-holder-2">
              <div className="content-holder">
                <h1 className="white-heading-2 hero-holder">
                  Building better
                  <span className="smaller-head fwf">
                    <br />
                    launch communities
                  </span>
                </h1>
                <p className="body-paragraphy-2 light hero-subhead">
                  Create network effects, get feedback, and de-risk your customer acquisition cost.
                </p>
                <a href="https://airtable.com/shrTxWeRwlAxyBwQ2" className="cta-button-2 w-button">
                  Join Waitlist
                </a>
              </div>
              <div className="right-img-area w-clearfix">
                <img
                  src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6285296c07bf5c12c7bc7dae_people-tile-tryvest-head-2.png"
                  alt="showing contact cards and social icons"
                  className="hero-image-right"
                />
              </div>
            </div>
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg"
              alt="yellow blob shape"
              className="image-13 process hero-shape-1"
            />
          </div>
          <div id="how-it-works" className="how-it-works wf-section">
            <div className="section-body-div hiw">
              <div className="how-it-works div">
                <h3 className="text udesly-typewriter">
                  Get users through a <br />
                  low-risk, low-effort, <span className="text-span">low-cost</span> system
                </h3>
              </div>
              <div className="right-steps hiw"/>
            </div>
          </div>
          <div id="how-it-works" className="how-it-works wf-section">
            <div className="section-body-div hiw">
              <div className="how-it-works div">
                <div className="subhead-2 v3 hiw">HOW&nbsp;IT&nbsp;WORKS</div>
                <h3 className="text thinner less-space">
                  <strong>With Tryvest...</strong>
                </h3>
              </div>
              <div className="right-steps hiw">
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a268a086e66aef27af8e58_Button%20style-amico.svg"
                    loading="lazy"
                    width="234"
                    alt=""
                    className="image-18"
                  />
                  <div className="number _2">1</div>
                  <div className="hiw-head">Users find your company and express interest</div>
                  <p className="hiw-para">
                    Through your website, users can be incentivized to join with equity rewards
                  </p>
                </div>
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a269b553db6ee7eb7142fa_Mobile%20inbox-amico.svg"
                    loading="lazy"
                    width="235"
                    alt=""
                    className="image-20"
                  />
                  <div className="number _2">2</div>
                  <div className="hiw-head">Users join Tryvest and complete terms</div>
                  <p className="hiw-para">Keep tabs on your Tryvestors and seamlessly communicate with them</p>
                </div>
                <div className="stepblock hiw">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62a2693e426a4853fdf3ee33_Refer%20a%20friend-amico.svg"
                    loading="lazy"
                    width="235"
                    alt=""
                    className="image-19"
                  />
                  <div className="number _2">3</div>
                  <div className="hiw-head">Users receive phantom equity and join launch community</div>
                  <p className="hiw-para">Phantom equity is off your cap table, so you retain ownership</p>
                </div>
              </div>
              <a href="https://airtable.com/shrTxWeRwlAxyBwQ2" className="cta-button-2 middle w-button">
                Join Waitlist
              </a>
            </div>
          </div>
          <div id="process" className="section process wf-section">
            <div className="section-body-div">
              <div className="right-steps"/>
            </div>
            <img
              src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/62852b01cd37f26f45e03744_tryvest_blob-shape.svg"
              alt="yellow blob 2"
              width="700"
              className="image-14 process _2"
            />
            <div className="thanks-div-2">
              <img
                src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/6299869f94ea0f2216e5e1c9_kaushikandbrett.svg"
                loading="lazy"
                width="350"
                height="350"
                alt=""
                className="image-16"
              />
              <div className="div-block bjnrtibet">
                <h2 className="title-header thanks ibfnoibneob">
                  Meet Brett and Kaushik
                  <br />
                  <span className="smaller-head">
                    Read about the story behind Tryvest and find out where we are going.
                    <br />{' '}
                  </span>
                </h2>
                <a href="/founder" className="cta-button-2 middle rgwg w-button">
                  Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section wf-section">
          <div className="columns w-row">
            <div className="column-4 w-col w-col-3 w-col-stack">
              <div className="copyright-text-2">Copyright © 2022,&nbsp;tryvest.us</div>
            </div>
            <div className="column-5 w-clearfix w-col w-col-9 w-col-stack">
              <div className="footer-div-2 right">
                <a href="mailto:brett@tryvest.us" className="footer-link-2">
                  Contact
                </a>
                <a href="/privacy-policy" className="footer-link-2">
                  Privacy
                </a>
                <a
                  href="https://www.instagram.com/tryvestus/?hl=en"
                  className="social-img w-inline-block"
                >
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628730ba2f392d1f39778b5e_87390.png"
                    width="25"
                    alt=""
                  />
                </a>
                <a href="https://www.linkedin.com/company/tryvest/?viewAsMember=true" className="w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/628734418cfe41537abdd5bd_download__3_-removebg-preview.png"
                    loading="lazy"
                    width="24"
                    alt=""
                    className="image-15"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=62851205cdcbe027038914be"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />
        <script
          src="https://uploads-ssl.webflow.com/62851205cdcbe027038914be/js/webflow.2484c7b6c.js"
          type="text/javascript"
        />
        { // <!--[if lte IE 9]><script src="//cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js"></script><![endif]--> }
 */