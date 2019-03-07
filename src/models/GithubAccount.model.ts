import {OwnerModel} from "./Owner.model";

export class GithubAccountModel {
  name: string;
  html_url: string;
  owner: OwnerModel;
  forks: number;
  open_issues: number;
  watchers: number;

  constructor(data?: any) {
    this.name = data.name || '';
    this.html_url = data.html_url || '';
    this.owner = {...data.owner} || {};
    this.forks = data.forks || 0;
    this.open_issues = data.open_issues || 0;
    this.watchers = data.watchers || 0;
  }
}
