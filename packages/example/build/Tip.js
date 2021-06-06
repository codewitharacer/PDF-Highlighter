function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style/Tip.css';

class Tip extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, 'state', {
      compact: true,
      text: '',
      emoji: ''
    });
  }

  // for TipContainer
  componentDidUpdate(nextProps, nextState) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen, style } = this.props;
    const { compact, text, emoji } = this.state;
    return ReactDOM.createPortal(
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className: 'Tip Tip__container',
          style: style
        },

          compact ? /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'Tip__compact Tip__container',
              onClick: () => {
                onOpen();
                this.setState({
                  compact: false
                });
              }
            },
            'Add highlight'
          ) :
          /*#__PURE__*/ React.createElement(
            'form',
            {
              className: 'Tip__card Tip__container',
              onSubmit: event => {
                event.preventDefault();
                onConfirm({
                  text,
                  emoji
                });
              }
            },
            /*#__PURE__*/ React.createElement(
              'div',
              { className: 'Tip__container' },
              /*#__PURE__*/ React.createElement('textarea', {
                className: 'Tip__container',
                width: '100%',
                placeholder: 'Make a Note',
                autoFocus: true,
                value: text,
                onChange: event =>
                  this.setState({
                    text: event.target.value
                  }),
                ref: node => {
                  if (node) {
                    node.focus();
                  }
                }
              })
              // /*#__PURE__*/ React.createElement(
              //   'div',
              //   null,
              //   [ '💩', '😱', '😍', '🔥', '😳', '⚠️' ].map(_emoji =>
              //     /*#__PURE__*/ React.createElement(
              //       'label',
              //       {
              //         key: _emoji
              //       },
              //       /*#__PURE__*/ React.createElement('input', {
              //         checked: emoji === _emoji,
              //         type: 'radio',
              //         name: 'emoji',
              //         value: _emoji,
              //         onChange: event =>
              //           this.setState({
              //             emoji: event.target.value
              //           })
              //       }),
              //       _emoji
              //     )
              //   )
              // )
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              { className: 'Tip__container' },
              /*#__PURE__*/ React.createElement('input', {
                className: 'Tip__container',
                type: 'submit',
                value: 'Save'
              })
            )
          )
      ),
      document.getElementsByClassName('PdfHighlighter')[0]
    );
  }
}

export default Tip;
