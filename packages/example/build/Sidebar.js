import React from "react";

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sidebar",
    style: {
      width: "25vw"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "description",
    style: {
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: "1rem"
    }
  }, "react-pdf-highlighter"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.7rem"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/agentcooper/react-pdf-highlighter"
  }, "Open in GitHub")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", null, "To create area highlight hold \u2325 Option key (Alt), then click and drag."))), /*#__PURE__*/React.createElement("ul", {
    className: "sidebar__highlights"
  }, highlights.map((highlight, index) => /*#__PURE__*/React.createElement("li", {
    key: index,
    className: "sidebar__highlight",
    onClick: () => {
      updateHash(highlight);
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, highlight.comment.text), highlight.content.text ? /*#__PURE__*/React.createElement("blockquote", {
    style: {
      marginTop: "0.5rem"
    }
  }, `${highlight.content.text.slice(0, 90).trim()}…`) : null, highlight.content.image ? /*#__PURE__*/React.createElement("div", {
    className: "highlight__image",
    style: {
      marginTop: "0.5rem"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: highlight.content.image,
    alt: "Screenshot"
  })) : null), /*#__PURE__*/React.createElement("div", {
    className: "highlight__location"
  }, "Page ", highlight.position.pageNumber)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleDocument
  }, "Toggle PDF document")), highlights.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: resetHighlights
  }, "Reset highlights")) : null);
}

export default Sidebar;