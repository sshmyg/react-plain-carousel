'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

        _initialiseProps.call(_this);

        var children = _this.props.children;

        var slidesNumbers = _react.Children.count(children);
        var isInfinity = _this.props.isInfinity && slidesNumbers > 1;

        _this.wrapperRef = (0, _react.createRef)();
        _this.innerRef = (0, _react.createRef)();

        _this.state = {
            isMounted: false,
            customTransform: undefined,
            index: isInfinity ? 1 : 0,
            isInfinity: isInfinity,
            slidesNumbers: isInfinity ? slidesNumbers + 2 : slidesNumbers,
            isTransition: null, //animate moving or not
            isTransitionInProgress: false,
            transitionEventName: 'transitionend'
        };
        return _this;
    }

    _createClass(ReactCarousel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var transitionEventName = this.state.transitionEventName;
            var onMount = this.props.onMount;


            this.$wrapper = this.wrapperRef.current;
            this.$inner = this.innerRef.current;

            this.setState({
                width: this.getWrapperWidth(),
                isMounted: true
            });

            this.initAutoplay();

            window.addEventListener('resize', this.handleResize);
            this.$inner.addEventListener(transitionEventName, this.handleTransitionEnd);

            onMount({
                next: function next() {
                    return _this2.move(1);
                },
                prev: function prev() {
                    return _this2.move(-1);
                },
                moveTo: function moveTo(index) {
                    return typeof index === 'number' ? _this2._moveTo({ index: index + 1 }) : undefined;
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
                    _this3._moveTo({
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
                    _this3._moveTo({
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
            var transitionEventName = this.state.transitionEventName;


            this.stopAutoplay();
            window.removeEventListener('resize', this.handleResize);
            this.$inner.removeEventListener(transitionEventName, this.handleTransitionEnd);
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

            this._moveTo({
                index: index + delta,
                customTransform: undefined
            });
        }
    }, {
        key: '_moveTo',
        value: function _moveTo() {
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
            if (this.autoplayInterval) {
                this.autoplayInterval = clearInterval(this.autoplayInterval);
                return true;
            }

            return false;
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
        key: 'render',
        value: function render() {
            var _props$className = this.props.className,
                className = _props$className === undefined ? '' : _props$className;
            var _state6 = this.state,
                isMounted = _state6.isMounted,
                customTransform = _state6.customTransform;
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
                _react2.default.createElement(
                    'div',
                    {
                        style: _extends({}, inner, {
                            width: innerWidth
                        }, transformStyles, animationStyles),
                        ref: this.innerRef
                    },
                    children
                )
            );
        }
    }]);

    return ReactCarousel;
}(_react.Component), _class.defaultProps = {
    startSlideIndex: 0,
    isInfinity: false,
    autoplay: false,
    autoplayDelay: 1000,
    transitionTimingFunc: 'ease',
    transitionDelay: 500,
    onTransitionEnd: null,
    className: undefined,
    children: undefined,
    onMount: function onMount() {}
}, _initialiseProps = function _initialiseProps() {
    var _this5 = this;

    this.autoplayInterval = undefined;
    this.touchStart = {};
    this.touchMove = {};
    this.isLongTouch = false;

    this.cloneChild = function (child) {
        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!child) {
            return false;
        }

        var width = _this5.state.width;


        var slide = _extends({}, defaultStyles.slide, {
            width: width
        });

        return _react2.default.cloneElement(child, _extends({
            style: _extends({}, slide, child.props.style || {})
        }, props));
    };

    this.handleTouchStart = function (e) {
        var touches = e.touches;


        setTimeout(function () {
            _this5.isLongTouch = true;
        }, 250);

        _this5.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY,
            time: +new Date()
        };
    };

    this.handleTouchMove = function (e) {
        var touches = e.touches,
            scale = e.scale;
        var _state7 = _this5.state,
            index = _state7.index,
            width = _state7.width;

        // ensure swiping with one touch and not pinching

        if (touches.length > 1 || scale && scale !== 1) {
            return;
        }

        //e.preventDefault();

        var x = touches[0].pageX;
        var y = touches[0].pageY;

        _this5.touchMove = {
            x: x,
            y: y,
            time: +new Date(),
            deltaX: index * width + (_this5.touchStart.x - x)
        };

        _this5.setState(function () {
            return {
                customTransform: _this5.touchMove.deltaX,
                isTransition: false
            };
        });
    };

    this.handleTouchEnd = function () {
        var _state8 = _this5.state,
            index = _state8.index,
            isInfinity = _state8.isInfinity,
            width = _state8.width,
            slidesNumbers = _state8.slidesNumbers;
        var deltaX = _this5.touchMove.deltaX;

        var absMove = Math.abs(index * width - deltaX);
        //const isFirstSlide = index === 0;
        var isLastSlide = slidesNumbers - (index + 1) === 0;
        var moveDelta = deltaX > index * width ? 1 : -1;
        var handleState = function handleState() {
            return {
                customTransform: undefined,
                isTransition: true
            };
        };

        if (!isInfinity) {
            if (!_this5.isLongTouch || absMove > width / 2) {
                if (isLastSlide && moveDelta === 1) {
                    _this5.setState(handleState);
                } else {
                    _this5.move(moveDelta);
                }
            } else {
                _this5.setState(handleState);
            }
        } else {
            if (!_this5.isLongTouch || absMove > width / 2) {
                _this5.move(moveDelta);
            } else {
                _this5.setState(handleState);
            }
        }

        // if (!this.isLongTouch || absMove > width / 2) {
        //     this.move(moveDelta);
        // } else {
        //     this.setState(handleState);
        // }

        _this5.touchStart = {};
        _this5.touchMove = {};
        _this5.isLongTouch = false;
    };

    this.handleResize = function () {
        _this5.setState(function () {
            return { width: _this5.getWrapperWidth() };
        });
    };

    this.handleTransitionEnd = function () {
        var onTransitionEnd = _this5.props.onTransitionEnd;

        var index = _this5.getRealIndex();

        _this5.setState({ isTransitionInProgress: false });

        typeof onTransitionEnd === 'function' && onTransitionEnd({ index: index });
    };
}, _temp);
exports.default = ReactCarousel;