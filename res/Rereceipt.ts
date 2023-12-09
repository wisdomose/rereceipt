import Media from "./File";
import Firebase from "./Firebase";
import Template from "./Template";
import User from "./User";

export default class Rereceipt extends Firebase {
  static instance: Rereceipt | null = null;
  template;
  media;
  user;

  constructor() {
    if (Rereceipt.instance) return Rereceipt.instance;

    super();

    this.template = new Template();
    this.media = new Media();
    this.user = new User();

    Rereceipt.instance = this;
  }
}