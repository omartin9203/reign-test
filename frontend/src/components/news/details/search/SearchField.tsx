import {Component} from "react";
import autobind from "autobind-decorator";
import './SearchField.css';

const ENTER_KEY = 13;
const SEARCH_BUTTON_EDGE = 35;

export const SearchIcon = () => {
  const iconEdge = Math.ceil(SEARCH_BUTTON_EDGE * 0.60);
  const searchIconStyle = {
    fill: '#727272',
  };
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      width={iconEdge}
      height={iconEdge}
      viewBox="0 0 635 635"
      style={searchIconStyle}
    >
      <g>
        <path d="M255.108,0C119.863,0,10.204,109.66,10.204,244.904c0,135.245,109.659,244.905,244.904,244.905
          c52.006,0,100.238-16.223,139.883-43.854l185.205,185.176c1.671,1.672,4.379,1.672,5.964,0.115l34.892-34.891
          c1.613-1.613,1.47-4.379-0.115-5.965L438.151,407.605c38.493-43.246,61.86-100.237,61.86-162.702
          C500.012,109.66,390.353,0,255.108,0z M255.108,460.996c-119.34,0-216.092-96.752-216.092-216.092
          c0-119.34,96.751-216.091,216.092-216.091s216.091,96.751,216.091,216.091C471.199,364.244,374.448,460.996,255.108,460.996z"
        />
      </g>
    </svg>
  );
};

type SearchFieldProps = {
  classNames?: string;
  searchText: string,
  placeholder: string,
  onChange?: (value: string) => void,
  onEnter?: (value: string) => void,
  onSearchClick?: (value: string) => void,
  onBlur?: (value: string) => void,
}

type SearchFieldState = {
  value: string;
}

class SearchField extends Component<SearchFieldProps, SearchFieldState> {
  constructor(props: SearchFieldProps) {
    super(props);
    this.state = {
      value: this.props.searchText,
    };
  }

  componentWillReceiveProps(nextProps: SearchFieldProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        value: nextProps.searchText,
      });
    }
  }

  @autobind
  onChangeBound(event: any) {
    this.setState({
      value: event.target.value,
    });
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  @autobind
  onEnterBound(event: any) {
    const isEnterPressed = event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed && this.props.onEnter) {
      this.props.onEnter(event.target.value);
    }
  }

  @autobind
  onSearchClick() {
    if (this.props.onSearchClick) {
      this.props.onSearchClick(this.state.value);
    }
  }

  @autobind
  onBlurBound(event: any) {
    if (this.props.onBlur) {
      this.props.onBlur(event.target.value);
    }
  }

  render() {
    const {
      classNames,
      placeholder,
    } = this.props;
    const className = [`react-search-field`, classNames].filter(x => !!x).join(' ');

    return (
      <div
        className={className}
      >
        <input
          className="react-search-field-input"
          onChange={this.onChangeBound}
          onKeyPress={this.onEnterBound}
          onBlur={this.onBlurBound}
          placeholder={placeholder}
          type="text"
          value={this.state.value}
        />
        <button
          className="react-search-field-button"
          type="button"
          aria-label="search button"
          onClick={this.onSearchClick}
        >
          <SearchIcon />
        </button>
      </div>
    );
  }
}

export default SearchField;