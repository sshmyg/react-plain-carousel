import React, {
    Component,
    Children,
    createRef
} from 'react';

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

export default class ReactCarousel extends Component {
    /* static propTypes = {
        isInfinity: PropTypes.bool,
        autoplay: PropTypes.bool,
        autoplayDelay: PropTypes.number,
        transitionTimingFunc: PropTypes.string,
        transitionDelay: PropTypes.number,
        longTouchDelay: PropTypes.number,
        onTransitionEnd: PropTypes.func,
        className: PropTypes.string,
        innerClassName: PropTypes.string,
        children: PropTypes.node,
        onMount: PropTypes.func,
    } */

    static defaultProps = {
        isInfinity: false,
        autoplay: false,
        autoplayDelay: 5000,
        transitionTimingFunc: 'ease',
        transitionDelay: 500,
        longTouchDelay: 250,
        onTransitionEnd: undefined,
        className: '',
        innerClassName: '',
        children: undefined,
        onMount: () => {}
    }

    constructor(...args) {
        super(...args);

        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.cloneChild = this.cloneChild.bind(this);

        const { children } = this.props;
        const slidesNumbers = Children.count(children);
        const isInfinity = this.props.isInfinity && slidesNumbers > 1;

        this.wrapperRef = createRef();

        this.state = {
            isMounted: false,
            customTransform: undefined,
            realIndex: 0,
            index: isInfinity ? 1 : 0,
            isInfinity,
            slidesNumbers: isInfinity ? slidesNumbers + 2 : slidesNumbers,
            isTransition: false, //animate slide move or not
            isTransitionInProgress: false
        };
    }

    componentDidMount() {
        const { onMount } = this.props;

        this.$wrapper = this.wrapperRef.current;

        this.setState({
            width: this.getWrapperWidth(),
            isMounted: true
        });

        this.initAutoplay();

        window.addEventListener('resize', this.handleResize);

        onMount({
            next: () => this.move(1),
            prev: () => this.move(-1),
            moveTo: index => typeof index === 'number'
                ? this.moveTo({ index: index + 1 })
                : undefined
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            index,
            isInfinity,
            slidesNumbers,
            isTransitionInProgress
        } = this.state;

        if (!isInfinity && (index === slidesNumbers - 1) && !isTransitionInProgress) {
            this.stopAutoplay();
        }

        if (!isInfinity) {
            return;
        }

        //Silent move to last slide
        if (index === 0 && prevState.isTransitionInProgress && !isTransitionInProgress) {
            //Add delay for smooth changing from first to last slide in infinity mode
            setTimeout(() => {
                this.moveTo({
                    index: slidesNumbers - 2,
                    isTransition: false,
                    isTransitionInProgress: false
                });
            }, 17);
        }

        //Silent move to first slide
        if ((slidesNumbers - 1 === index) && prevState.isTransitionInProgress && !isTransitionInProgress) {
            //Add delay for smooth changing from last to first slide in infinity mode
            setTimeout(() => {
                this.moveTo({
                    index: 1,
                    isTransition: false,
                    isTransitionInProgress: false
                });
            }, 17);
        }
    }

    componentWillUnmount() {
        this.stopAutoplay();
        window.removeEventListener('resize', this.handleResize);
    }

    autoplayInterval = undefined

    touchStart = {}

    touchMove = {}

    isLongTouch = false

    getWrapperWidth() {
        return this.$wrapper && this.$wrapper.clientWidth;
    }

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

    cloneChild(child, props = {}) {
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
            this.cloneChild(clonedChildren[clonedChildren.length - 1], { key: 'clonedlast' }),
            ...clonedChildren,
            this.cloneChild(clonedChildren[0], { key: 'clonedfirst' })
        ];
    }

    move(delta) {
        const {
            index,
            isTransitionInProgress,
            slidesNumbers
        } = this.state;

        if (
            !delta ||
            (index === (slidesNumbers - 1) && delta > 0)
            || (index === 0 && delta < 0)
            || isTransitionInProgress
        ) {
            return false;
        }

        this.moveTo({
            index: index + delta,
            customTransform: undefined
        });
    }

    moveTo(state = {}) {
        this.initAutoplay();

        this.setState(() => ({
            isTransition: true,
            isTransitionInProgress: true,
            ...state
        }));
    }

    getRealIndex() {
        const {
            index,
            isInfinity,
            slidesNumbers
        } = this.state;

        if (!isInfinity) {
            return index;
        }

        if (slidesNumbers - 1 === index) {
            return 0;
        }

        return index - 1;
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
        this.autoplayInterval = this.autoplayInterval
            ? clearInterval(this.autoplayInterval)
            : this.autoplayInterval;
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

        this.autoplayInterval = setInterval(() => this.move(1), autoplayDelay);
    }

    handleTouchStart(e) {
        const { touches } = e;

        setTimeout(() => {
            this.isLongTouch = true;
        }, this.props.longTouchDelay);

        this.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY,
            time: +new Date()
        };
    }

    handleTouchMove(e) {
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

        //e.preventDefault();

        const x = touches[0].pageX;
        const y = touches[0].pageY;

        this.touchMove = {
            x,
            y,
            time: +new Date(),
            deltaX: index * width + (this.touchStart.x - x)
        };

        this.setState({
            customTransform: this.touchMove.deltaX,
            isTransition: false
        });
    }

    handleTouchEnd() {
        const {
            index,
            isInfinity,
            width,
            slidesNumbers
        } = this.state;
        const { deltaX } = this.touchMove;
        const absMove = Math.abs(index * width - deltaX);
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

        this.touchStart = {};
        this.touchMove = {};
        this.isLongTouch = false;
    }

    handleResize() {
        this.setState({ width: this.getWrapperWidth() });
    }

    handleTransitionEnd() {
        const { onTransitionEnd } = this.props;
        const index = this.getRealIndex();

        this.setState({
            isTransitionInProgress: false,
            realIndex: index
        });

        typeof onTransitionEnd === 'function' && onTransitionEnd({ index });
    }

    render() {
        const {
            className,
            innerClassName
        } = this.props;
        const {
            isMounted,
            customTransform
        } = this.state;
        const {
            wrapper,
            inner
        } = defaultStyles;
        const children = isMounted ? this.getChildren() : null;
        const innerWidth = this.getInnerWidth();
        const transformStyles = this.calcTransform(customTransform);
        const animationStyles = this.calcAnimation();

        return (
            <div
                className={className}
                style={wrapper}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                ref={this.wrapperRef}
            >
                <div
                    style={{
                        ...inner,
                        width: innerWidth,
                        ...transformStyles,
                        ...animationStyles
                    }}
                    className={innerClassName}
                    onTransitionEnd={this.handleTransitionEnd}
                >
                    { children }
                </div>
            </div>
        );
    }
}
