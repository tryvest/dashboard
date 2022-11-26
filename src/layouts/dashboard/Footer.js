import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Stack, Typography} from "@mui/material";
import {LightLogo} from "../../components/Logo";

function FooterNav() {
    return null;
}

function Footer(props) {
    const theme = useTheme();
    const color = "darkgray"
    const fontSize = "13px"

    return (
        <Stack marginTop={"10px"} padding={"15px"} spacing={1} style={{backgroundColor: theme.palette.primary.dark, position: "relative", bottom: 0}} zIndex={1300}>
            <Stack direction={"row"}>
                <FooterNav/>
            </Stack>
            <Typography fontSize={fontSize} color={color}>
                This site (the "Site") is owned and maintained by Tryvest Inc., which is not a registered broker-dealer. Tryvest Inc. does not give investment advice, endorsement, analysis or recommendations with respect to any securities. All securities listed here are being offered by, and all information included on this Site is the responsibility of, the applicable issuer of such securities. Tryvest Inc. is a registered funding portal and FINRA member.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                All funding-portal activities are conducted by Tryvest Incorporated doing business as Tryvest, a funding portal which is registered with the US Securities and Exchange Commission (SEC) as a funding portal (Portal) and is a member of the Financial Industry Regulatory Authority (FINRA). Tryvest Inc. is located at 4304 Lusardi Pt. Manhattan, KS 66503.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                Tryvest does not make investment recommendations and no communication, through this Site or in any other medium should be construed as a recommendation for any security offered on or off this investment platform. Investment opportunities posted on this Site are private placements of securities that are not publicly traded, involve a high degree of risk, may lose value, are subject to holding period requirements and are intended for investors who do not need a liquid investment. Past performance is not indicative of future results. Investors must be able to afford the loss of their entire investment. Only qualified investors may invest in offerings hosted by Tryvest.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                Neither Tryvest, nor any of their officers, directors, agents and employees makes any warranty, express or implied, of any kind whatsoever related to the adequacy, accuracy or completeness of any information on this Site or the use of information on this site. Offers to sell securities can only be made through official offering documents that contain important information about the investment and the issuers, including risks. Investors should carefully read the offering documents. Investors should conduct their own due diligence and are encouraged to consult with their tax, legal and financial advisors.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                By accessing the Site and any pages thereof, you agree to be bound by the Terms of Use and Privacy Policy. All issuers offering securities under regulation crowdfunding as hosted by Tryvest Inc are listed on the Discover Page. The inclusion or exclusion of an issuer on the Discover Page and/or Tryvest’s Homepage, which includes offerings conducted under regulation crowdfunding, is not based upon any endorsement or recommendation by Tryvest, nor any of their affiliates, officers, directors, agents, and employees. Rather, issuers of securities may, in their sole discretion, opt-out of being listed on the Discover Page and Homepage.
            </Typography>
            <Typography fontWeight={1000} fontSize={fontSize} color={color}>
                Investors should verify any issuer information they consider important before making an investment.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                Investments in private companies are particularly risky and may result in total loss of invested capital. Past performance of a security or a company does not guarantee future results or returns. Only investors who understand the risks of early stage investment and who meet Tryvest’s investment criteria may invest.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                Tryvest does not verify information provided by companies on this Site and makes no assurance as to the completeness or accuracy of any such information. Additional information about companies fundraising on the Site can be found by searching the EDGAR database, or the offering documentation located on the Site when the offering does not require an EDGAR filing.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. Therefore, when you use the Services we will ask for your name, address, date of birth, and other information that will allow us to identify you. We may also ask to see your driver's license, passport or other identifying documents.
            </Typography>
            <Typography fontSize={fontSize} color={color}>
                Tryvest is not an Escrow Agent and uses Goldstar Trust for all of its escrow services. All investments are held with GoldStar Trust before they are invested at the closing of a funding round.
            </Typography>
        </Stack>
    );
}

export default Footer;