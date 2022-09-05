import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { ButtonBox, ButtonText } from './styles'

const Button = ({
  width,
  height,
  bgColor,
  fontColor,
  radius,
  text,
  fontSize,
  onClick,
}) => {
  const theme = useContext(ThemeContext)
  return (
    <ButtonBox
      width={width}
      height={height}
      bgColor={bgColor}
      radius={radius}
      onClick={() => onClick()}
    >
      <ButtonText color={fontColor || "#fff"} fontSize={fontSize}>
        {text}
      </ButtonText>
    </ButtonBox>
  )
}

export default Button
