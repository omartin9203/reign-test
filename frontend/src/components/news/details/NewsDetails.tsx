import {withNewsInfoStore, WithNewsInfoStoreProps} from "../../../stores/modules/news.store";
import {PageParamsDto} from "../../../interfaces/core/page-params.dto";
import {OrderByNews, WhereNews} from "../../../interfaces/dto/news/filter-news.dto";
import React, {Component} from "react";
import autobind from "autobind-decorator";
import {NewsServices} from "../../../services/news.services";
import {NewsItem} from "../item/NewsItem";
import logo from '../../../logo.svg';
import "./NewsDetails.css";
import SearchField from "./search/SearchField";
import { Pagination, PageData } from 'paginate-react'

interface NewsDetailsProps extends WithNewsInfoStoreProps {
}

interface NewsDetailsState {
  search: string;
  pageParams: PageParamsDto;
  where?: WhereNews;
  order?: OrderByNews;

  deleting: boolean;
}

class NewsDetails extends Component<NewsDetailsProps, NewsDetailsState>{
  private readonly _service = new NewsServices();

  constructor(props: NewsDetailsProps) {
    super(props);
    this.state = {
      pageParams: {
        pageNum: 1,
        pageLimit: 20,
      },
      search: '',
      deleting: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  @autobind
  onDelete(id: string) {
    const callback = () => {
      this._service.disableNews(id)
        .finally(() => this.setState({...this.state, deleting: false}, this.load))
    }
    this.setState({
      ...this.state,
      deleting: true,
    }, callback);
  }

  @autobind
  load() {
    const {NewsStore} = this.props;
    NewsStore.getNewsAsync(
      this.state.pageParams,
      [
        { author: { contains: this.state.search }, },
        { title: { contains: this.state.search }, },
        { storyTitle: { contains: this.state.search }, },
      ]
    );
  }

  @autobind
  onNext() {
    const {totalPages} = this.props.NewsStore.state.data;
    if(this.state.pageParams.pageNum >= totalPages) return;
    this.setState({
      ...this.state,
      pageParams: {
        pageLimit: this.state.pageParams.pageLimit,
        pageNum: this.state.pageParams.pageNum + 1,
      }
    }, this.load);
  }

  @autobind
  onPrev() {
    if(this.state.pageParams.pageNum <= 1) return;
    this.setState({
      ...this.state,
      pageParams: {
        pageLimit: this.state.pageParams.pageLimit,
        pageNum: this.state.pageParams.pageNum - 1,
      }
    }, this.load);
  }

  @autobind
  onChangeSearch(text: string) {
    this.setState({
      ...this.state,
      pageParams: {
        pageLimit: this.state.pageParams.pageLimit,
        pageNum: 1,
      },
      search: text,
    }, this.load);
  }

  @autobind
  onChangePage(page: PageData) {
    this.setState({
      ...this.state,
      pageParams: {
        pageLimit: this.state.pageParams.pageLimit,
        pageNum: page.currentPage,
      }
    }, this.load);
  }

  @autobind
  onChangeLimit(limit: number) {
    this.setState({
      ...this.state,
      pageParams: {
        pageLimit: limit,
        pageNum: 1,
      }
    }, this.load);
  }

  render() {
    const { NewsStore } = this.props;
    const {loading, data} = NewsStore.state;
    const next = this.state.pageParams.pageNum < data.totalPages
    return (
      <div className="root">
        <div className="search">
          <SearchField
            searchText={this.state.search}
            onEnter={this.onChangeSearch}
            onSearchClick={this.onChangeSearch}
            placeholder={'search'}
          />
        </div>
        <div className="items">
          {
            loading || this.state.deleting
              ? <img src={logo} className="App-logo" alt="logo" />
              : data.items.map(item => (
                <NewsItem key={item.id} item={item} onDelete={this.onDelete} />
              ))
          }
        </div>
        <div className="pagination">
          <button className="pagination-button" onClick={this.onPrev}>prev</button>
          <span>pag {this.state.pageParams.pageNum} of {data.totalPages}</span>
          <button className="pagination-button" onClick={this.onNext}>next</button>
          <div className="pagination-limit">
            <label className="label">Items per page: </label>
            <select
              className="select"
              value={this.state.pageParams.pageLimit}
              onChange={e => this.onChangeLimit(+e.target.value)}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default withNewsInfoStore(NewsDetails);
