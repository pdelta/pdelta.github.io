import { PureComponent } from 'react';

export default class ScrollTopMount extends PureComponent {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}