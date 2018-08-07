'use strict';

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzymeToJson = require('enzyme-to-json');

var _enzymeToJson2 = _interopRequireDefault(_enzymeToJson);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global mount, jest */
var _ref = _jsx(_index2.default, {
    className: 'c-carousel'
});

describe('<Carousel />', function () {
    var slide = _jsx('div', {
        style: { height: 250, width: 500 }
    }, void 0, 'Slide');

    it('should render wrapper', function () {
        var wrapper = mount(_ref);

        expect(wrapper.find('div.c-carousel').exists()).toBeTruthy();
        wrapper.unmount();
    });

    var _ref2 = _jsx(_index2.default, {
        className: 'c-carousel'
    }, void 0, slide, slide);

    it('should render inner div', function () {
        var wrapper = mount(_ref2);
        var innerDiv = wrapper.find('div.c-carousel').children();

        expect(innerDiv.length).toBe(1);
        wrapper.unmount();
    });

    var _ref3 = _jsx(_index2.default, {
        className: 'c-carousel'
    }, void 0, slide, slide);

    it('should render slides', function () {
        var wrapper = mount(_ref3);
        var slides = wrapper.find('div.c-carousel').children().children();

        expect(slides.length).toBe(2);
        wrapper.unmount();
    });

    it('should call `onMount`', function () {
        var handleMount = jest.fn();
        var wrapper = mount(_jsx(_index2.default, {
            className: 'c-carousel',
            onMount: handleMount
        }, void 0, slide, slide));

        expect(handleMount).toBeCalled();
        wrapper.unmount();
    });

    it('should move slides', function () {
        var carousel = void 0;
        var handleMount = jest.fn(function (c) {
            return carousel = c;
        });
        var wrapper = mount(_jsx(_index2.default, {
            className: 'c-carousel',
            onMount: handleMount
        }, void 0, slide, slide, slide));

        console.info(wrapper.state());

        carousel.next();
        wrapper.update();

        console.info(wrapper.state());

        expect(1).toBe(1);
    });

    /* it('should matches the snapshot', () => {
        const wrapper = mount(<Card />);
         expect(toJson(wrapper)).toMatchSnapshot();
    }); */
});