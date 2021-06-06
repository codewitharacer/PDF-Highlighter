/* eslint import/no-webpack-loader-syntax: 0 */
import React, { Component } from 'react';
import PDFWorker from 'worker-loader!pdfjs-dist/lib/pdf.worker';
// import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight, setPdfWorker } from 'react-pdf-highlighter';
// import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight, setPdfWorker } from 'react-pdf-highlighter';
import testHighlights from './test-highlights';
import Spinner from './Spinner';
import Sidebar from './Sidebar';
import Tip from './Tip';
import PdfLoader, { setPdfWorker } from './components/PdfLoader';
import PdfHighlighter from './components/PdfHighlighter';
import Highlight from './components/Highlight';
import Popup from './components/Popup';
import AreaHighlight from './components/AreaHighlight';
import './style/App.css';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
setPdfWorker(PDFWorker);

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

const clamp = (value, left, right) => Math.min(Math.max(value, left), right);

const HighlightPopup = ({ comment }) =>

    comment.text ? /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'Highlight__popup'
      },
      comment.emoji,
      ' ',
      comment.text
    ) :
    null;

const PRIMARY_PDF_URL = 'https://arxiv.org/pdf/1708.08021.pdf';
const SECONDARY_PDF_URL = 'https://arxiv.org/pdf/1604.02480.pdf';
const searchParams = new URLSearchParams(document.location.search);
const initialUrl = searchParams.get('url') || PRIMARY_PDF_URL;

class App extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, 'state', {
      url: this.props.url || initialUrl,
      highlights: this.props.highlights || [],
      showAddTooltip: false
    });

    _defineProperty(this, 'transformSelection', () => {});

    _defineProperty(this, 'hideTipAndSelection', () => {});

    _defineProperty(this, 'position', {});

    _defineProperty(this, 'content', {});

    _defineProperty(this, 'viewer', {});

    _defineProperty(this, 'page', {});

    _defineProperty(this, 'resetHighlights', () => {
      this.setState({
        highlights: []
      });
    });

    _defineProperty(this, 'toggleDocument', () => {
      const newUrl =

          this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL :
          PRIMARY_PDF_URL;
      this.setState({
        url: newUrl,
        highlights:
          testHighlights[newUrl] ? [ ...testHighlights[newUrl] ] :
          []
      });
    });

    _defineProperty(this, 'scrollViewerTo', highlight => {});

    _defineProperty(this, 'scrollToHighlightFromHash', () => {
      const highlight = this.getHighlightById(parseIdFromHash());

      if (highlight) {
        this.scrollViewerTo(highlight);
      }
    });
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.scrollToHighlightFromHash, false);
  }

  getHighlightById(id) {
    const { highlights } = this.state;
    return highlights.find(highlight => highlight.id === id);
  }

  addHighlight(highlight) {
    const { highlights } = this.state;
    this.setState(
      {
        highlights: [
          {
            ...highlight,
            id: getNextId()
          },
          ...highlights
        ]
      },
      () => this.props.onHighlightsChange(this.state.highlights)
    );
  }

  updateHighlight(highlightId, position, content) {
    this.setState({
      highlights: this.state.highlights.map(h => {
        const { id, position: originalPosition, content: originalContent, ...rest } = h;
        const obj =

            id === highlightId ? {
              id,
              position: {
                ...originalPosition,
                ...position
              },
              content: {
                ...originalContent,
                ...content
              },
              ...rest
            } :
            h;
        return obj;
      })
    });
  }

  render() {
    const { url, highlights, showAddTooltip } = this.state;
    return /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'App',
        style: {
          display: 'flex',
          height: '100vh'
        }
      },
      // /*#__PURE__*/ React.createElement(Sidebar, {
      //   highlights: highlights,
      //   resetHighlights: this.resetHighlights,
      //   toggleDocument: this.toggleDocument
      // }),
      /*#__PURE__*/ React.createElement(
        'div',
        {
          style: {
            height: '100vh',
            width: '75vw',
            position: 'relative'
          }
        },
        /*#__PURE__*/ React.createElement(
          PdfLoader,
          {
            url: url,
            beforeLoad: /*#__PURE__*/ React.createElement(Spinner, null)
          },
          pdfDocument =>
            /*#__PURE__*/ React.createElement(PdfHighlighter, {
              pdfDocument: pdfDocument,
              enableAreaSelection: event => event.altKey,
              onScrollChange: resetHash, // pdfScaleValue="page-width"
              scrollRef: scrollTo => {
                this.scrollViewerTo = scrollTo;
                this.scrollToHighlightFromHash();
              },
              closeTooltip: () => this.setState({ showAddTooltip: false }),
              onSelectionFinished: (
                position,
                content,
                hideTipAndSelection,
                transformSelection,
                viewer,
                viewportPosition
              ) => {
                this.setState({
                  showAddTooltip: false
                });
                this.transformSelection = transformSelection;
                this.hideTipAndSelection = hideTipAndSelection;
                this.position = position;
                this.content = content;
                const page = {
                  node: viewer.getPageView(viewportPosition.pageNumber - 1).div
                };
                const scrollTop = viewer.container.scrollTop;
                const pageBoundingRect = page.node.getBoundingClientRect();
                const style = {
                  left:
                    page.node.offsetLeft +
                    viewportPosition.boundingRect.left +
                    viewportPosition.boundingRect.width / 2 -
                    52,
                  top: viewportPosition.boundingRect.top + page.node.offsetTop,
                  bottom: viewportPosition.boundingRect.top + page.node.offsetTop + viewportPosition.boundingRect.height
                };
                const { offsetHeight: height, offsetWidth: width } = container;
                const shouldMove = style.top - height - 5 < scrollTop;
                this.top =
                  shouldMove ? style.bottom + 5 :
                  style.top - height - 5;
                this.left = style.left;
                this.setState({
                  showAddTooltip: true
                });
              },
              highlightTransform: (highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
                const isTextHighlight = !Boolean(highlight.content && highlight.content.image);
                const component =
                  isTextHighlight ? /*#__PURE__*/ React.createElement(Highlight, {
                    isScrolledTo: isScrolledTo,
                    position: highlight.position,
                    comment: highlight.comment
                  }) :
                  /*#__PURE__*/ React.createElement(AreaHighlight, {
                    highlight: highlight,
                    onChange: boundingRect => {
                      this.updateHighlight(
                        highlight.id,
                        {
                          boundingRect: viewportToScaled(boundingRect)
                        },
                        {
                          image: screenshot(boundingRect)
                        }
                      );
                    }
                  });
                return /*#__PURE__*/ React.createElement(Popup, {
                  popupContent: /*#__PURE__*/ React.createElement(HighlightPopup, highlight),
                  onMouseOver: popupContent => setTip(highlight, highlight => popupContent),
                  onMouseOut: hideTip,
                  key: index,
                  children: component
                });
              },
              highlights: highlights
            })
        )
      ),
      showAddTooltip &&
        /*#__PURE__*/ React.createElement(Tip, {
          style: {
            top: this.top,
            left: this.left,
            position: 'absolute',
            zIndex: 6
          },
          onOpen: this.transformSelection,
          onConfirm: comment => {
            this.addHighlight({
              content: this.content,
              position: this.position,
              comment
            });
            this.hideTipAndSelection();
            this.setState({
              showAddTooltip: false
            });
          }
        })
    );
  }
}

export default App;
