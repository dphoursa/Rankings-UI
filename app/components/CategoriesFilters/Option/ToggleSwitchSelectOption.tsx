import * as React from 'react';
import styled from 'styles/styled-components';
import DisciplineIcon from 'components/Icons/categories/DisciplineIcon';
import WorldIcon from 'components/Icons/categories/WorldIcon';
interface Props {
  title: string;
  isSelected: boolean;
  selectedValue: string;
}

class ToggleSwitchSelectOption extends React.PureComponent<Props> {
  public render() {
    return (
      <Wrapper disabled={!this.props.isSelected}>
        <WorldIcon value={this.props.selectedValue} />
        <span>{this.props.title}</span>
      </Wrapper>
    );
  }
}
interface WrapperProps {
  disabled: boolean;
}
const Wrapper = styled<WrapperProps, 'div'>('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  & span {
    font-size: 1em;
    margin-top: 2px;
    color: ${props => props.theme.textPrimary};
    text-align: center;
  }
`;
export default ToggleSwitchSelectOption;
