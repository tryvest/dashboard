import styled from 'styled-components'

export const CompanyTileBox = styled.div`
  width: 1073px;
  background-color: white;
  border-color: black;
  border-width: 5px;
`

export const QuickInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 200px;
  margin-left: 30px;
  margin-top: 15px;
`

export const ButtonBox = styled.button`
  min-width: 120px;
  height: 60px;
  background-color: white;
  border-color: black;
  border-width: 5px;
  border-radius: 20;
  display: flex;
  flex-direction: row;
`

export const CompanyLogo = styled.div`
  height: 95px;
  width: 240px;
  border-radius: 20;
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const Stockback = styled.div`
  margin-left: 75px;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`

export const SizedBox = styled.div`
  width: 1px;
`

export const CompanyName = styled.p`
  font-size: 22px;
  color: black;
  font-weight: 600;
  font-family: Averta, sans-serif;
  text-align: left;
`

export const SloganText = styled.p`
  font-size: 16px;
  color: black;
  font-style: italic;
  font-weight: 400;
  font-family: Averta, sans-serif;
  text-align: left;
`

export const OneLinerText = styled.p`
  font-size: 14px;
  color: black;
  font-weight: 500;
  font-family: Averta, sans-serif;
  margin-left: 25px;
  text-align: left;
  min-width: 200px;
  width: 246px;
  min-height: 40px;
  max-lines: 2;
  margin-top: 15px;
`