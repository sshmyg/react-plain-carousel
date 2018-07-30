'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _src = require('../src');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestComponent = function (_React$Component) {
    _inherits(TestComponent, _React$Component);

    function TestComponent() {
        _classCallCheck(this, TestComponent);

        return _possibleConstructorReturn(this, (TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).apply(this, arguments));
    }

    _createClass(TestComponent, [{
        key: 'next',
        value: function next() {
            this.refs.carousel.next();
        }
    }, {
        key: 'prev',
        value: function prev() {
            this.refs.carousel.prev();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { width: '100%' } },
                _react2.default.createElement(
                    _src2.default,
                    {
                        className: 'carousel',
                        ref: 'carousel',
                        isInfinity: false,
                        autoplay: false,
                        autoplayDelay: 5000
                    },
                    _react2.default.createElement(
                        'div',
                        { style: { height: 250, backgroundColor: 'red' } },
                        'Slide - 1'
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: { height: 250, backgroundColor: 'green' } },
                        'Slide - 2'
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: { height: 250, backgroundColor: 'blue' } },
                        'Slide - 3'
                    )
                ),
                _react2.default.createElement(
                    'button',
                    { onClick: this.prev.bind(this) },
                    'Prev'
                ),
                _react2.default.createElement(
                    'button',
                    { onClick: this.next.bind(this) },
                    'Next'
                )
            );
        }
    }]);

    return TestComponent;
}(_react2.default.Component);

(0, _reactDom.render)(_react2.default.createElement(TestComponent, null), document.querySelector('#root'));
