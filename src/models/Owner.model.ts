export class OwnerModel {
  html_url: string;
  avatar_url: string;

  constructor(data?: any) {
    this.html_url = data.html_url || '';
    this.avatar_url= data.avatar_url || '';
  }
}
