/**
 *
 * Rankings
 *
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as selectors from './selectors';
import reducer from './reducer';
import saga from './saga';

import { RootState, ContainerState, TableItem } from './types';
import TabPanel from 'components/TabPanel';
import MainTableSection from 'components/MainTableSection';
import MainTable from './MainTable';

import * as actions from './actions';

import { replace } from 'connected-react-router';
import CategoriesFilters from 'components/CategoriesFilters';
import {
  ISelectOption,
  IFilter,
  ICategory,
} from 'components/CategoriesFilters/types';

interface OwnProps {}

interface StateProps {
  categories: ContainerState['categories'];
  contestFilter: ContainerState['contestFilter'];
  tableResult: ContainerState['tableResult'];
  isTableItemsLoading: ContainerState['isTableItemsLoading'];
  isNextTableItemsLoading: ContainerState['isNextTableItemsLoading'];
  // isCategoriesOpen: ContainerState['isCategoriesOpen'];
  // isCategoriesOpenOnce: ContainerState['isCategoriesOpenOnce'];
}

interface DispatchProps {
  dispatch: Dispatch;
  updateLocation(path: string, id: string);
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {}

class Contests extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    if (!this.props.tableResult || this.props.tableResult.items.length === 0) {
      this.props.dispatch(actions.loadTableItems());
      this.props.dispatch(actions.loadCategories());
    }
  }

  private onCategorySelected = (index: number) => (value: string) => {
    this.props.dispatch(actions.setCategorySelectedValue(index, value));
    this.props.dispatch(actions.loadTableItems());
  };

  private categories(): ICategory[] {
    const categories = this.props.categories;
    if (categories) {
      return categories.map((category, i) => {
        return {
          title: category.title,
          options: category.options,
          selectedValue: category.selectedValue,
          categorySelected: this.onCategorySelected(i),
        };
      });
    }
    return [];
  }

  private loadContestSuggestions = (value: string) => {
    this.props.dispatch(actions.loadContestSuggestions(value));
  };

  private selectContestSuggestion = (suggestion: ISelectOption) => {
    this.props.dispatch(
      actions.setContestFilterSelectedValue(suggestion.value),
    );
    this.props.dispatch(actions.loadTableItems());
  };

  private filters(): IFilter[] {
    const contestFilter: IFilter = {
      title: 'Contest',
      placeholder: 'Name of the contest',
      loadSuggestions: this.loadContestSuggestions,
      suggestionSelected: this.selectContestSuggestion,
      suggestions: this.props.contestFilter.suggestions,
      selectedValue: this.props.contestFilter.selectedValue,
    };
    return [contestFilter];
  }

  private loadMoreItems = () => {
    this.props.dispatch(actions.loadNextItems());
  };

  public render() {
    const categories = this.categories();
    const filters = this.filters();
    const openCategories = false;
    return (
      <TabPanel>
        <CategoriesFilters
          isOpen={openCategories}
          categories={categories}
          filters={filters}
        />
        <MainTableSection>
          <MainTable
            tableItems={this.props.tableResult}
            // onRowSelected={this.onTableRowSelected}
            isItemsLoading={this.props.isTableItemsLoading}
            showMoreClicked={this.loadMoreItems}
            isNextItemsLoading={this.props.isNextTableItemsLoading}
          />
        </MainTableSection>
      </TabPanel>
    );
  }
}

const mapStateToProps = createStructuredSelector<RootState, StateProps>({
  categories: selectors.selectCategories(),
  contestFilter: selectors.selectContestFilter(),
  tableResult: selectors.selectTableResult(),
  isTableItemsLoading: selectors.selectIsTableItemsLoading(),
  isNextTableItemsLoading: selectors.selectIsNextTableItemsLoading(),
  // isCategoriesOpen: selectors.selectIsCategoriesOpen(),
  // isCategoriesOpenOnce: selectors.selectIsCategoriesOpenOnce(),
});

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps {
  return {
    dispatch: dispatch,
    updateLocation: (path: string, id: string) => {
      if (id) {
        dispatch(replace(`/${path}/${id}`));
      }
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer<OwnProps>({
  key: 'contests',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({ key: 'contests', saga: saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Contests);
