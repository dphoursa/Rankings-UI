import * as React from 'react';
import styled from 'styles/styled-components';
import { FieldProps } from 'formik';
import { ContestFormValues } from '../types';
import { isNil } from 'lodash';
import Wrapper from './Wrapper';
import ErrorLabel from './ErrorLabel';
import { ISelectOption } from 'types/application';

interface Props {
  categories: ISelectOption[];
}

class CategoryInput extends React.PureComponent<
  Props & FieldProps<ContestFormValues>
> {
  public render() {
    const field = this.props.field;
    const { touched, errors } = this.props.form;
    const isError = touched[field.name] && !isNil(errors[field.name]);

    return (
      <Wrapper>
        <div>
          <Span>Category: </Span>
          <select {...field} value={field.value} placeholder="Category">
            <option value={-1}>None</option>
            {this.props.categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        {isError && <ErrorLabel>{errors[field.name]}</ErrorLabel>}
      </Wrapper>
    );
  }
}

const Span = styled.span`
  color: ${props => props.theme.textPrimary};
`;

export default CategoryInput;
