import React, { Component, createRef } from 'react';
import FontAwesome from 'react-fontawesome';
import './global.scss';
import './styles.scss';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    const { title } = this.props;

    this.state = {
      open: false,
      headerTitle: title,
      keyword: ''
    };

    this.searchField = createRef();
    this.close = this.close.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { list, title } = nextProps;
    const selectedItem = list.filter((item) => item.selected);
    if (selectedItem.length) {
      return { headerTitle: selectedItem[0].title };
    }
    return { headerTitle: title };
  }

  componentDidUpdate() {
    const { open } = this.state;

    setTimeout(() => {
      if (open) {
        window.addEventListener('click', this.close);
      } else {
        window.removeEventListener('click', this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
  }

  close = () => {
    this.setState({ open: false });
  }

  selectItem(title, id, stateKey) {
    const { resetThenSet } = this.props;

    this.setState(
      {
        headerTitle: title,
        open: false
      },
      resetThenSet(id, stateKey)
    );
  }

  toggleList() {
    this.setState(
      (prevState) => ({
        open: !prevState.open,
        keyword: ''
      }),
      () => {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state.open && this.searchField.current) {
          this.searchField.current.focus();
          this.setState({
            keyword: ''
          });
        }
      }
    );
  }

  filterList(e) {
    this.setState({
      keyword: e.target.value.toLowerCase()
    });
  }

  listItems() {
    const { list, searchable } = this.props;
    const { keyword } = this.state;

    let tempList = list;

    if (keyword.length) {
      tempList = list
        .filter((item) => item.title.toLowerCase().slice(0, keyword.length).includes(keyword))
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
    }

    if (tempList.length) {
      return tempList.map((item) => (
        <button
          type="button"
          className="dd-list-item"
          key={item.id}
          onClick={() => this.selectItem(item.title, item.id, item.key)}
        >
          {item.title} {item.selected && <FontAwesome name="check" />}
        </button>
      ));
    }

    return <div className="dd-list-item no-result">{searchable[1]}</div>;
  }

  render() {
    const { searchable } = this.props;
    const { open, headerTitle } = this.state;

    return (
      <div className="dd-wrapper">
        <button type="button" className="dd-header" onClick={() => this.toggleList()}>
          <div className="dd-header-title">{headerTitle}</div>
          {open ? <FontAwesome name="angle-up" size="2x" /> : <FontAwesome name="angle-down" size="2x" />}
        </button>
        {open && (
          <div role="list" className={`dd-list ${searchable ? 'searchable' : ''}`} onClick={(e) => e.stopPropagation()}>
            {searchable && (
              <input
                ref={this.searchField}
                className="dd-list-search-bar"
                placeholder={searchable[0]}
                onChange={(e) => this.filterList(e)}
              />
            )}
            <div className="dd-scroll-list">{this.listItems()}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
