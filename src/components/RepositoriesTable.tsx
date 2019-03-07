import React, {SyntheticEvent} from 'react';
import ReactDOM from 'react-dom';
import { Column } from "../interfaces/Column.interface";
import {GithubAccountModel} from "../models/GithubAccount.model";
import axios from 'axios'
import config from '../config'

import './RepositoriesTable.scss';

const baseUrl = `${config.baseUrl}search/repositories`;

class RepositoriesTable extends React.PureComponent<{}, {
  columns:Array<Column>,
  data:Array<GithubAccountModel>,
  maxShow: number,
  isLoading: boolean,
  page: number,
  scrollEl: Node | null,
  error: string
}, {}> {
  constructor (props: Object) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          title: 'Name',
          field: 'name',
          width: 250
        },
        {
          title: 'Url',
          field: 'html_url',
          width: 300,
          render: (el: GithubAccountModel) => <a href={el.html_url} target='_blank' className='table__url'>{el.html_url}</a>
        },
        {
          title: 'Owner',
          field: 'owner',
          render: (el: GithubAccountModel) => <a href={el.owner.html_url} target='_blank' className='owner'>
            <img src={el.owner.avatar_url} className='owner__avatar'/>
          </a>
        },
        {
          title: 'Forks',
          field: 'forks'
        },
        {
          title: 'Open issues',
          field: 'open_issues'
        },
        {
          title: 'Watchers',
          field: 'watchers'
        }
      ],
      page: 0,
      maxShow: 0,
      isLoading: false,
      scrollEl: null,
      error: ''
    };
    this.loadMore = this.loadMore.bind(this);
    this.scrollListener = this.scrollListener.bind(this);
  }

  componentDidMount(): void {
    this.setState({scrollEl: ReactDOM.findDOMNode(this)});
    this.loadMore();
  }

  loadMore ():void {
    const {state: {maxShow, data, page}} = this;
    const newMaxShow = maxShow + 20;
    const isServerRequest = data.length + 20 <= newMaxShow && data.length < 1000 && !this.state.isLoading;
    const newPage = page + 1;

    if (isServerRequest) {
      this.setState({
        isLoading: isServerRequest
      });
      axios.get(baseUrl, {
        params: {
          q: 'language=javascript',
          sort: 'stars',
          order:'desc',
          per_page: 100,
          page: newPage
        }})
        .then(({data: {items}}) => {
          this.setState({
            isLoading: false,
            data: data.concat(items),
            maxShow: newMaxShow,
            page: newPage
          }, this.checkLoading);
        })
        .catch(({message}) => {
          this.setState({
            isLoading: false,
            maxShow: newMaxShow,
            error: message
          });
        })
    } else {
      this.setState({
        maxShow: newMaxShow
      }, this.checkLoading)
    }


  }

  checkLoading () {
    if (this.state.maxShow && (ReactDOM.findDOMNode(this) as HTMLElement).clientHeight < document.documentElement.scrollHeight) {
      this.loadMore()
    }
  }

  scrollListener (e: SyntheticEvent<HTMLDivElement>):void {
    if (e.currentTarget.scrollTop + e.currentTarget.offsetHeight === e.currentTarget.scrollHeight ) {
      this.loadMore()
    }
  }

  renderHeader () {
    return this.state.columns.map((column:Column, index:number) => (<td key={index}>{column.title}</td>));
  }

  renderTableData () {
    const {state: {data, maxShow, columns}} = this;

    return data && data.map((account:GithubAccountModel, index:number) => (
      index < maxShow && <tr key={index}>
        {columns.map((column:Column, columnIndex: number) => (
          <td key={columnIndex} style={{'width': `${column.width}px` || 'auto'}}>{column.render ? column.render(account) : account[column.field]}</td>)
        )}
      </tr>
    ));
  }

  render () {
    return (
      <div className='table' onScroll={this.scrollListener}>
        <table>
          <thead>
          <tr>
            {this.renderHeader()}
          </tr>
          </thead>
          <tbody>
          {this.renderTableData()}
          </tbody>
        </table>
        <div className='loading'>
          <div className='orbit-spinner'>
            <div className='orbit one'/>
            <div className='orbit two'/>
            <div className='orbit three'/>
          </div>
        </div>
        {this.state.error && <div className='error'>{this.state.error}</div> }
      </div>
    )
  }
}

export default RepositoriesTable
