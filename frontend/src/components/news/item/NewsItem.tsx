import {Component} from "react";
import {NewsDto} from "../../../interfaces/dto/news/news.dto";
import moment from "moment";
import './NewsItem.css';
import autobind from "autobind-decorator";

interface NewsDetailsProps {
  item: NewsDto;
  onDelete: (id: string) => void;
}

interface NewsDetailsState {
  selected: boolean;
}

export class NewsItem extends Component<NewsDetailsProps, NewsDetailsState>{
  constructor(props: NewsDetailsProps) {
    super(props);
    this.state = {
      selected: false
    };
  }

  @autobind
  onDelete() {
    const { item, onDelete } = this.props;
    if(window.confirm('Are you sure?')) {
      onDelete(item.id);
    }
  }

  render() {
    const { item } = this.props;
    const date = moment(item.createdAt).calendar({
      sameDay: 'LT',
      nextDay: '[Tomorrow]',
      nextWeek: 'MMM D',
      lastDay: '[Yesterday]',
      lastWeek: 'MMM D',
      sameElse: 'MMM D'
    });

    return (
      <div className="news-item" onClick={() => window.open(item.storyUrl || item.url)}>
        <div className="news-item-content">
          <p className="news-item-content-title">
            {item.title || item.storyTitle}
          </p>
          <span className="news-item-content-author">- {item.author} -</span>
        </div>
        <div>
          <span className="news-item-content-date">{date}</span>
          <img
            className="news-item-content-icon"
            onClick={this.onDelete}
            src="http://simpleicon.com/wp-content/uploads/trash.svg"
          />
        </div>
      </div>
    );
  }
}