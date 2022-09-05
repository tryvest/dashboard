import styled from 'styled-components'

export const ButtonBox = styled.button`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => props.bgColor};
  border: none;
  border-radius: ${props => props.radius};
  opacity: ${props => (props.disable ? 0.5 : 1)};

  &:hover {
    cursor: ${props => (props.disable ? 'default' : 'pointer')};
  }

  &:active {
    opacity: 0.7;
  }
`

export const ButtonText = styled.p`
  font-size: ${props => props.fontSize};
  color: ${props => props.color};
  margin-top: 3px;
`
