import {GithubAccountModel} from "../models/GithubAccount.model";

export interface Column {
  title: string;
  field: keyof GithubAccountModel;
  width?: number;
  render?: Function;
}
