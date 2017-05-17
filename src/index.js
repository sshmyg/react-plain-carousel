import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

const defaultStyles = {
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

export default class ReactCarousel extends React.Component {
    static propTypes = {
        startSlideIndex: PropTypes.number,
        isInfinity: PropTypes.bool,
        autoplay: PropTypes.bool,
        autoplayDelay: PropTypes.number,
        transitionTimingFunc: PropTypes.string,
        transitionDelay: PropTypes.number,
        onTransitionEnd: PropTypes.func,
        className: PropTypes.string,
        children: PropTypes.node,
    }

    static defaultProps = {
        startSlideIndex: 0,
        isInfinity: false,
        autoplay: false,
        autoplayDelay: 1000,
        transitionTimingFunc: 'ease',
        transitionDelay: 500,
        onTransitionEnd: null
    }

    constructor(...args) {
        super(...args);

        const { children } = this.props;
        const slidesNumbers = Children.count(children);
        const isInfinity = this.props.isInfinity && slidesNumbers > 1;

        this.state = {
            isMounted: false,
            customTransform: undefined,
            index: isInfinity ? 1 : 0,
            isInfinity,
            slidesNumbers: isInfinity ? slidesNumbers + 2 : slidesNumbers
        };
    }

    componentDidMount() {
        this.setState({
            width: this.$wrapper && this.$wrapper.clientWidth,
            isMounted: true
        });

        this.initAutoplay();
    }

    componentDidUpdate() {
        const {
            index,
            isTransition,
            isInfinity,
            slidesNumbers
        } = this.state;

        if (!isInfinity && (index === slidesNumbers - 1) && !isTransition) {
            this.stopAutoplay();
        }

        if (!isInfinity) {
            return;
        }

        //Silent move to last slide
        if (index === 0 && !isTransition) {
            this.moveTo({
                index: slidesNumbers - 2,
                isTransition: false
            });
        }

        //Silent move to first slide
        if ((slidesNumbers - 1 === index) && !isTransition) {
            this.moveTo({
                index: 1,
                isTransition: false
            });
        }
    }

    componentWillUnmount() {
        this.stopAutoplay();
    }

    autoplayInterval = undefined

    touchStart = {}

    touchMove = {}

    isLongTouch = false

    getInnerWidth() {
        const {
            width,
            slidesNumbers
        } = this.state;

        if (!width || !slidesNumbers) {
            return null;
        }

        return width * slidesNumbers;
    }

    cloneChild = (child, props = {}) => {
        if (!child) {
            return false;
        }

        const { width } = this.state;

        const slide = {
            ...defaultStyles.slide,
            width
        };

        return React.cloneElement(child, {
            style: {
                ...slide,
                ...(child.props.style || {}),
            },
            ...props
        });
    }

    getChildren() {
        const { children } = this.props;
        const { isInfinity } = this.state;

        const clonedChildren = Children.map(children, this.cloneChild);

        if (!isInfinity) {
            return clonedChildren;
        }

        return [
            this.cloneChild(clonedChildren[clonedChildren.length - 1], {key: 'clonedlast'}),
            ...clonedChildren,
            this.cloneChild(clonedChildren[0], {key: 'clonedfirst'})
        ];
    }

    next = () => {
        this.move(1);
    }

    prev = () => {
        this.move(-1);
    }

    getIndex(delta = 1) {
        const {
            index,
            isInfinity,
            slidesNumbers
        } = this.state;

        if (!isInfinity) {
            return index;
        }

        if (index - delta > slidesNumbers - 2 - delta) {
            return 0;
        }

        return index - delta;
    }

    move(delta) {
        const {
            onTransitionEnd,
            transitionDelay
        } = this.props;
        let {
            index,
            isTransition,
            slidesNumbers
        } = this.state;

        if (
            !delta ||
            (index === (slidesNumbers - 1) && delta > 0)
            || (index === 0 && delta < 0)
            || isTransition
        ) {
            return false;
        }

        this.initAutoplay();

        index = index + delta;

        this.setState(() => ({
            index,
            delta,
            isTransition: true,
            customTransform: undefined
        }));

        setTimeout(() => {
            this.setState(() => ({ isTransition: false }));
            typeof onTransitionEnd === 'function' && onTransitionEnd({ index: this.getIndex() });
        }, transitionDelay);
    }

    moveTo({ index, isTransition }) {
        this.setState({
            index,
            isTransition
        });
    }

    calcTransform(value, direction = '-') {
        const {
            index,
            width
        } = this.state;

        value = value || (index * width);

        return {
            transform: `translate3d(${direction}${value}px, 0, 0)`
        };
    }

    calcAnimation() {
        const {
            transitionTimingFunc,
            transitionDelay
        } = this.props;
        const { isTransition } = this.state;
        let transitionDelayCssValue = transitionDelay / 100;

        if (transitionDelayCssValue < 1000) {
            transitionDelayCssValue = `.${transitionDelayCssValue}`;
        }

        return isTransition ? { transition: `transform ${transitionDelayCssValue}s ${transitionTimingFunc}` } : {};
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            this.autoplayInterval = clearInterval(this.autoplayInterval);
            return true;
        }

        return false;
    }

    initAutoplay() {
        const {
            autoplayDelay,
            transitionDelay,
            autoplay
        } = this.props;
        const { slidesNumbers } = this.state;

        if (!autoplay || slidesNumbers <= 1) {
            return false;
        }

        if (autoplayDelay < transitionDelay) {
            throw new Error('`autoplayDelay` less than `transitionDelay`, fix it');
        }

        this.stopAutoplay();

        this.autoplayInterval = setInterval(this.next, autoplayDelay);
    }

    handleTouchStart = (e) => {
        const { touches } = e;

        setTimeout(() => {
            this.isLongTouch = true;
        }, 250);

        this.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY,
            time: +new Date()
        };
    }

    handleTouchMove = (e) => {
        const {
            touches,
            scale
        } = e;
        const {
            index,
            width
        } = this.state;

        // ensure swiping with one touch and not pinching
        if (touches.length > 1 || scale && scale !== 1) {
            return;
        }

        e.preventDefault();

        const x = touches[0].pageX;
        const y = touches[0].pageY;

        this.touchMove = {
            x,
            y,
            time: +new Date(),
            deltaX: index * width + (this.touchStart.x - x)
        };

        this.setState(() => ({
            customTransform: this.touchMove.deltaX,
            isTransition: false
        }));
    }

    handleTouchEnd = () => {
        const {
            index,
            isInfinity,
            width,
            slidesNumbers
        } = this.state;
        const { deltaX } = this.touchMove;
        const absMove = Math.abs(index * width - deltaX);
        const isFirstSlide = index === 0;
        const isLastSlide = (slidesNumbers - (index + 1) === 0);
        const moveDelta = deltaX > index * width ? 1 : -1;
        const handleState = () => ({
            customTransform: undefined,
            isTransition: true
        });

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

        // if (!this.isLongTouch || absMove > width / 2) {
        //     this.move(moveDelta);
        // } else {
        //     this.setState(handleState);
        // }

        this.touchStart = {};
        this.touchMove = {};
        this.isLongTouch = false;
    }

    render() {
        const { className } = this.props;
        const { isMounted, customTransform } = this.state;
        const {
            wrapper,
            inner
        } = defaultStyles;
        const innerWidth = this.getInnerWidth();
        const transformStyles = this.calcTransform(customTransform);
        const animationStyles = this.calcAnimation();

        return (
            <div
                className={className}
                style={wrapper}
                ref={el => this.$wrapper = el}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                <div
                    style={{
                        ...inner,
                        width: innerWidth,
                        ...transformStyles,
                        ...animationStyles
                    }}
                    ref={el => this.$inner = el}
                >
                    {
                        isMounted
                        ? this.getChildren()
                        : null
                    }
                </div>
            </div>
        );
    }
}
