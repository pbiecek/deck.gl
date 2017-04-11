/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {json as requestJson} from 'd3-request';

import DeckGLOverlay from './deckgl-overlay.js';

class Root extends Component {
  //
  // REACT LIFECYCLE
  //
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 500,
        height: 500
      },
      data: null
    };

    this._resize = this._resize.bind(this);
    this._animate = this._animate.bind(this);
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._getNodeColor = this._getNodeColor.bind(this);

    requestJson('./data/sample-graph.json', (error, response) => {
      if (!error) {
        // apply timestamp and push loaded sample data into array
        this.setState({
          data: response
        });
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    this._animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
  }

  _animate() {
    this.forceUpdate();
    if (typeof window !== 'undefined') {
      this._animationFrame = window.requestAnimationFrame(this._animate);
    }
  }

  _resize() {
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onHover(el) {
    if (el) {
      this.setState({hovered: el.id});
    }
  }

  _onClick(el) {
    if (el) {
      this.setState({clicked: el.id});
    } else {
      const {clicked} = this.state;
      if (clicked) {
        this.setState({clicked: null});
      }
    }
  }

  _getNodeColor(node) {
    const {hovered, clicked} = this.state;
    const {id} = node;
    switch (id) {
    case clicked:
      return [255, 255, 0, 255];
    case hovered:
      return [255, 128, 0, 255];
    default:
      return [0, 128, 255, 255];
    }
  }

  render() {
    const {viewport, data} = this.state;
    const handlers = {
      onHover: this._onHover,
      onClick: this._onClick
    };
    const accessors = {
      getNodeColor: this._getNodeColor
    };

    return (
      <DeckGLOverlay
        viewport={viewport}
        data={data}
        {...handlers}
        {...accessors} />
    );
  }

}

render(<Root />, document.body.appendChild(document.createElement('div')));