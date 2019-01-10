'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyles = {
    wrapper: {
        overflow: 'hidden'
    },
    inner: {
        overflow: 'hidden'
    },
    slide: {
        float: 'left'
    }
};

var ReactCarousel = (_temp = _class = function (_Component) {
    _inherits(ReactCarousel, _Component);

    function ReactCarousel() {
        var _ref;

        _classCallCheck(this, ReactCarousel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ReactCarousel.__proto__ || Object.getPrototypeOf(ReactCarousel)).call.apply(_ref, [this].concat(args)));

        _this.autoplayInterval = undefined;
        _this.touchStart = {};
        _this.touchMove = {};
        _this.isLongTouch = false;


        _this.handleTransitionEnd = _this.handleTransitionEnd.bind(_this);
        _this.handleResize = _this.handleResize.bind(_this);
        _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
        _this.handleTouchMove = _this.handleTouchMove.bind(_this);
        _this.handleTouchStart = _this.handleTouchStart.bind(_this);
        _this.cloneChild = _this.cloneChild.bind(_this);

        var children = _this.props.children;

        var slidesNumbers = _react.Children.count(children);
        var isInfinity = _this.props.isInfinity && slidesNumbers > 1;

        _this.wrapperRef = (0, _react.createRef)();

        _this.state = {
            isMounted: false,
            customTransform: undefined,
            realIndex: 0,
            index: isInfinity ? 1 : 0,
            isInfinity: isInfinity,
            slidesNumbers: isInfinity ? slidesNumbers + 2 : slidesNumbers,
            isTransition: false, //animate slide move or not
            isTransitionInProgress: false
        };
        return _this;
    }

    _createClass(ReactCarousel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var onMount = this.props.onMount;


            this.$wrapper = this.wrapperRef.current;

            this.setState({
                width: this.getWrapperWidth(),
                isMounted: true
            });

            this.initAutoplay();

            window.addEventListener('resize', this.handleResize);

            onMount({
                next: function next() {
                    return _this2.move(1);
                },
                prev: function prev() {
                    return _this2.move(-1);
                },
                moveTo: function moveTo(index) {
                    return typeof index === 'number' ? _this2.moveTo({ index: index + 1 }) : undefined;
                }
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            var _this3 = this;

            var _state = this.state,
                index = _state.index,
                isInfinity = _state.isInfinity,
                slidesNumbers = _state.slidesNumbers,
                isTransitionInProgress = _state.isTransitionInProgress;


            if (!isInfinity && index === slidesNumbers - 1 && !isTransitionInProgress) {
                this.stopAutoplay();
            }

            if (!isInfinity) {
                return;
            }

            //Silent move to last slide
            if (index === 0 && prevState.isTransitionInProgress && !isTransitionInProgress) {
                //Add delay for smooth changing from first to last slide in infinity mode
                setTimeout(function () {
                    _this3.moveTo({
                        index: slidesNumbers - 2,
                        isTransition: false,
                        isTransitionInProgress: false
                    });
                }, 17);
            }

            //Silent move to first slide
            if (slidesNumbers - 1 === index && prevState.isTransitionInProgress && !isTransitionInProgress) {
                //Add delay for smooth changing from last to first slide in infinity mode
                setTimeout(function () {
                    _this3.moveTo({
                        index: 1,
                        isTransition: false,
                        isTransitionInProgress: false
                    });
                }, 17);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopAutoplay();
            window.removeEventListener('resize', this.handleResize);
        }
    }, {
        key: 'getWrapperWidth',
        value: function getWrapperWidth() {
            return this.$wrapper && this.$wrapper.clientWidth;
        }
    }, {
        key: 'getInnerWidth',
        value: function getInnerWidth() {
            var _state2 = this.state,
                width = _state2.width,
                slidesNumbers = _state2.slidesNumbers;


            if (!width || !slidesNumbers) {
                return null;
            }

            return width * slidesNumbers;
        }
    }, {
        key: 'cloneChild',
        value: function cloneChild(child) {
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (!child) {
                return false;
            }

            var width = this.state.width;


            var slide = _extends({}, defaultStyles.slide, {
                width: width
            });

            return _react2.default.cloneElement(child, _extends({
                style: _extends({}, slide, child.props.style || {})
            }, props));
        }
    }, {
        key: 'getChildren',
        value: function getChildren() {
            var children = this.props.children;
            var isInfinity = this.state.isInfinity;


            var clonedChildren = _react.Children.map(children, this.cloneChild);

            if (!isInfinity) {
                return clonedChildren;
            }

            return [this.cloneChild(clonedChildren[clonedChildren.length - 1], { key: 'clonedlast' })].concat(_toConsumableArray(clonedChildren), [this.cloneChild(clonedChildren[0], { key: 'clonedfirst' })]);
        }
    }, {
        key: 'move',
        value: function move(delta) {
            var _state3 = this.state,
                index = _state3.index,
                isTransitionInProgress = _state3.isTransitionInProgress,
                slidesNumbers = _state3.slidesNumbers;


            if (!delta || index === slidesNumbers - 1 && delta > 0 || index === 0 && delta < 0 || isTransitionInProgress) {
                return false;
            }

            this.moveTo({
                index: index + delta,
                customTransform: undefined
            });
        }
    }, {
        key: 'moveTo',
        value: function moveTo() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.initAutoplay();

            this.setState(function () {
                return _extends({
                    isTransition: true,
                    isTransitionInProgress: true
                }, state);
            });
        }
    }, {
        key: 'getRealIndex',
        value: function getRealIndex() {
            var _state4 = this.state,
                index = _state4.index,
                isInfinity = _state4.isInfinity,
                slidesNumbers = _state4.slidesNumbers;


            if (!isInfinity) {
                return index;
            }

            if (slidesNumbers - 1 === index) {
                return 0;
            }

            return index - 1;
        }
    }, {
        key: 'calcTransform',
        value: function calcTransform(value) {
            var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
            var _state5 = this.state,
                index = _state5.index,
                width = _state5.width;


            value = value || index * width;

            return {
                transform: 'translate3d(' + direction + value + 'px, 0, 0)'
            };
        }
    }, {
        key: 'calcAnimation',
        value: function calcAnimation() {
            var _props = this.props,
                transitionTimingFunc = _props.transitionTimingFunc,
                transitionDelay = _props.transitionDelay;
            var isTransition = this.state.isTransition;

            var transitionDelayCssValue = transitionDelay / 100;

            if (transitionDelayCssValue < 1000) {
                transitionDelayCssValue = '.' + transitionDelayCssValue;
            }

            return isTransition ? { transition: 'transform ' + transitionDelayCssValue + 's ' + transitionTimingFunc } : {};
        }
    }, {
        key: 'stopAutoplay',
        value: function stopAutoplay() {
            this.autoplayInterval = this.autoplayInterval ? clearInterval(this.autoplayInterval) : this.autoplayInterval;
        }
    }, {
        key: 'initAutoplay',
        value: function initAutoplay() {
            var _this4 = this;

            var _props2 = this.props,
                autoplayDelay = _props2.autoplayDelay,
                transitionDelay = _props2.transitionDelay,
                autoplay = _props2.autoplay;
            var slidesNumbers = this.state.slidesNumbers;


            if (!autoplay || slidesNumbers <= 1) {
                return false;
            }

            if (autoplayDelay < transitionDelay) {
                throw new Error('`autoplayDelay` less than `transitionDelay`, fix it');
            }

            this.stopAutoplay();

            this.autoplayInterval = setInterval(function () {
                return _this4.move(1);
            }, autoplayDelay);
        }
    }, {
        key: 'handleTouchStart',
        value: function handleTouchStart(e) {
            var _this5 = this;

            var touches = e.touches;


            setTimeout(function () {
                _this5.isLongTouch = true;
            }, 250);

            this.touchStart = {
                x: touches[0].pageX,
                y: touches[0].pageY,
                time: +new Date()
            };
        }
    }, {
        key: 'handleTouchMove',
        value: function handleTouchMove(e) {
            var touches = e.touches,
                scale = e.scale;
            var _state6 = this.state,
                index = _state6.index,
                width = _state6.width;

            // ensure swiping with one touch and not pinching

            if (touches.length > 1 || scale && scale !== 1) {
                return;
            }

            //e.preventDefault();

            var x = touches[0].pageX;
            var y = touches[0].pageY;

            this.touchMove = {
                x: x,
                y: y,
                time: +new Date(),
                deltaX: index * width + (this.touchStart.x - x)
            };

            this.setState({
                customTransform: this.touchMove.deltaX,
                isTransition: false
            });
        }
    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd() {
            var _state7 = this.state,
                index = _state7.index,
                isInfinity = _state7.isInfinity,
                width = _state7.width,
                slidesNumbers = _state7.slidesNumbers;
            var deltaX = this.touchMove.deltaX;

            var absMove = Math.abs(index * width - deltaX);
            var isLastSlide = slidesNumbers - (index + 1) === 0;
            var moveDelta = deltaX > index * width ? 1 : -1;
            var handleState = function handleState() {
                return {
                    customTransform: undefined,
                    isTransition: true
                };
            };

            if (!isInfinity) {
                if (!this.isLongTouch || absMove > width / 2) {
                    if (isLastSlide && moveDelta === 1) {
                        this.setState(handleState);
                    } else {
                        this.move(moveDelta);
                    }
                } else {
                    this.setState(handleState);
                }
            } else {
                if (!this.isLongTouch || absMove > width / 2) {
                    this.move(moveDelta);
                } else {
                    this.setState(handleState);
                }
            }

            this.touchStart = {};
            this.touchMove = {};
            this.isLongTouch = false;
        }
    }, {
        key: 'handleResize',
        value: function handleResize() {
            this.setState({ width: this.getWrapperWidth() });
        }
    }, {
        key: 'handleTransitionEnd',
        value: function handleTransitionEnd() {
            var onTransitionEnd = this.props.onTransitionEnd;

            var index = this.getRealIndex();

            this.setState({
                isTransitionInProgress: false,
                realIndex: index
            });

            typeof onTransitionEnd === 'function' && onTransitionEnd({ index: index });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                className = _props3.className,
                innerClassName = _props3.innerClassName;
            var _state8 = this.state,
                isMounted = _state8.isMounted,
                customTransform = _state8.customTransform;
            var wrapper = defaultStyles.wrapper,
                inner = defaultStyles.inner;

            var children = isMounted ? this.getChildren() : null;
            var innerWidth = this.getInnerWidth();
            var transformStyles = this.calcTransform(customTransform);
            var animationStyles = this.calcAnimation();

            return _react2.default.createElement(
                'div',
                {
                    className: className,
                    style: wrapper,
                    onTouchStart: this.handleTouchStart,
                    onTouchMove: this.handleTouchMove,
                    onTouchEnd: this.handleTouchEnd,
                    ref: this.wrapperRef
                },
                _jsx('div', {
                    style: _extends({}, inner, {
                        width: innerWidth
                    }, transformStyles, animationStyles),
                    className: innerClassName,
                    onTransitionEnd: this.handleTransitionEnd
                }, void 0, children)
            );
        }
    }]);

    return ReactCarousel;
}(_react.Component), _class.defaultProps = {
    isInfinity: false,
    autoplay: false,
    autoplayDelay: 5000,
    transitionTimingFunc: 'ease',
    transitionDelay: 500,
    onTransitionEnd: undefined,
    className: '',
    innerClassName: '',
    children: undefined,
    onMount: function onMount() {}
}, _temp);
exports.default = ReactCarousel;