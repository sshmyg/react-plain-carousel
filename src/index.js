import React from 'react';

 /*   -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
http://kenwheeler.github.io/slick/
https://raw.githubusercontent.com/kenwheeler/slick/master/slick/slick.js

https://github.com/thebird/Swipe/blob/master/swipe.js
http://voronianski.github.io/react-swipe/demo/
https://css-tricks.com/the-javascript-behind-touch-friendly-sliders/
    */

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
        startSlideIndex: React.PropTypes.number,
        isInfinity: React.PropTypes.bool,
        autoplay: React.PropTypes.bool,
        autoplayDelay: React.PropTypes.number,
        transitionTimingFunc: React.PropTypes.string,
        transitionDelay: React.PropTypes.number,
        onTransitionEnd: React.PropTypes.func,
        className: React.PropTypes.string,
        children: React.PropTypes.node,
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

        this.state = {
            isMounted: false,
            index: this.props.isInfinity ? 1 : 0
        };

        this.cloneChild = this.cloneChild.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    autoplayInterval = undefined

    touchStart = {}

    touchDelta = {}

    componentDidMount() {
        const { autoplay } = this.props;

        this.setState({ isMounted: true });

        autoplay && this.initAutoplay();
    }

    componentDidUpdate() {
        const { isInfinity } = this.props;
        const { index, isTransition } = this.state;
        const { slidesNumbers } = this.getParams();

        if (!isInfinity && (index === slidesNumbers - 1) && !isTransition) {
            this.stopAutoplay();
        }

        if (!isInfinity) {
            return;
        }

        //Silent move to last slide
        if (index === 0 && !isTransition) {
            this.moveTo({
                index: slidesNumbers - 2
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

    getParams() {
        let { isMounted } = this.state;

        if (!isMounted) {
            return {};
        }

        let { children, isInfinity } = this.props;
        let width = this.$wrapper.clientWidth;
        let slidesNumbers= React.Children.count(children);

        if (isInfinity) {
            slidesNumbers += 2;
        }

        return {
            width,
            slidesNumbers
        };
    }

    getInnerWidth() {
        let { width, slidesNumbers } = this.getParams();

        if (!width || !slidesNumbers) {
            return null;
        }

        return width * slidesNumbers;
    }

    cloneChild(child, props = {}) {
        if (!child) {
            return false;
        }

        let { width } = this.getParams();
        let { slide } = defaultStyles;

        slide = {
            ...slide,
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
        let { children, isInfinity } = this.props;

        let clonedChildren = React.Children.map(children, this.cloneChild);

        if (!isInfinity) {
            return clonedChildren;
        }

        return [
            this.cloneChild(clonedChildren[clonedChildren.length - 1], {key: 'clonedlast'}),
            ...clonedChildren,
            this.cloneChild(clonedChildren[0], {key: 'clonedfirst'})
        ];
    }

    next() {
        this.move(1);
    }

    prev() {
        this.move(-1);
    }

    move(delta) {
        let { onTransitionEnd, transitionDelay } = this.props;
        let { index, isTransition } = this.state;
        let { slidesNumbers } = this.getParams();

        if (
            !delta ||
            (index === (slidesNumbers - 1) && delta > 0)
            || (index === 0 && delta < 0)
            || isTransition
        ) {
            return false;
        }

        index = index + delta;

        this.setState({
            index,
            delta,
            isTransition: true
        });

        setTimeout(() => {
            this.setState({ isTransition: false });
            typeof onTransitionEnd === 'function' && onTransitionEnd();
        }, transitionDelay);
    }

    moveTo({ index, isTransition }) {
        this.setState({
            index,
            isTransition
        });
    }

    calcTransform() {
        let { index } = this.state;
        let { width } = this.getParams();

        return {
            transform: `translate3d(-${index * width}px, 0, 0)`
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
        const { autoplayDelay, transitionDelay } = this.props;

        if (autoplayDelay < transitionDelay) {
            throw new Error('`autoplayDelay` less than `transitionDelay`, fix it');
        }

        this.stopAutoplay();

        this.autoplayInterval = setInterval(this.next, autoplayDelay);
    }

    handleTouchStart(e) {
        const { touches } = e;

        this.touchStart = {
            x: touches[0].pageX,
            y: touches[0].pageY,
            time: +new Date()
        };

        this.touchDelta = {};
    }

    handleTouchMove(e) {
        const { touches, scale } = e;

        // ensure swiping with one touch and not pinching
        if (touches.length > 1 || scale && scale !== 1) {
            return;
        }

        this.touchDelta = {
            x: touches[0].pageX - this.touchStart.x,
            y: touches[0].pageY - this.touchStart.y
        };

        console.info(this.touchDelta);
    }

    handleTouchEnd(e) {

    }

    render() {
        let { className } = this.props;
        let { isMounted } = this.state;
        let {
            wrapper,
            inner
        } = defaultStyles;
        let innerWidth = this.getInnerWidth();
        let transformStyles = this.calcTransform();
        let animationStyles = this.calcAnimation();

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



// import React from 'react';

//  /*   -webkit-transform: translate3d(0, 0, 0);
//     -moz-transform: translate3d(0, 0, 0);
//     -ms-transform: translate3d(0, 0, 0);
//     -o-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
// http://kenwheeler.github.io/slick/
// https://raw.githubusercontent.com/kenwheeler/slick/master/slick/slick.js

// https://github.com/thebird/Swipe/blob/master/swipe.js
// http://voronianski.github.io/react-swipe/demo/
//     */

// const defaultStyles = {
//     wrapper: {
//         overflow: 'hidden'
//     },
//     inner: {
//         overflow: 'hidden'
//     },
//     slide: {
//         float: 'left'
//     }
// };

// export default class ReactCarousel extends React.Component {
//     static propTypes = {
//         startSlideIndex: React.PropTypes.number,
//         isInfinity: React.PropTypes.bool,
//         autoplay: React.PropTypes.bool,
//         autoplayDelay: React.PropTypes.number,
//         transitionTimingFunc: React.PropTypes.string,
//         transitionDelay: React.PropTypes.number,
//         onTransitionEnd: React.PropTypes.func,
//         className: React.PropTypes.string,
//         children: React.PropTypes.node,
//     }

//     static defaultProps = {
//         startSlideIndex: 0,
//         isInfinity: false,
//         autoplay: false,
//         autoplayDelay: 1000,
//         transitionTimingFunc: 'ease',
//         transitionDelay: 500,
//         onTransitionEnd: null
//     }

//     constructor(...args) {
//         super(...args);

//         this.state = {
//             isMounted: false,
//             index: this.props.isInfinity ? 1 : 0
//         };

//         this.cloneChild = this.cloneChild.bind(this);
//         this.prev = this.prev.bind(this);
//         this.next = this.next.bind(this);
//     }

//     autoplayInterval = undefined

//     componentDidMount() {
//         const { autoplay } = this.props;

//         this.setState({ isMounted: true });

//         autoplay && this.initAutoplay();
//     }

//     componentDidUpdate() {
//         const { isInfinity } = this.props;
//         const { index, isTransition } = this.state;
//         const { slidesNumbers } = this.getParams();

//         if (!isInfinity && (index === slidesNumbers - 1) && !isTransition) {
//             this.stopAutoplay();
//         }

//         if (!isInfinity) {
//             return;
//         }

//         //Silent move to last slide
//         if (index === 0 && !isTransition) {
//             this.moveTo({
//                 index: slidesNumbers - 2
//             });
//         }

//         //Silent move to first slide
//         if ((slidesNumbers - 1 === index) && !isTransition) {
//             this.moveTo({
//                 index: 1,
//                 isTransition: false
//             });
//         }
//     }

//     getParams() {
//         let { isMounted } = this.state;

//         if (!isMounted) {
//             return {};
//         }

//         let { children, isInfinity } = this.props;
//         let width = this.$wrapper.clientWidth;
//         let slidesNumbers= React.Children.count(children);

//         if (isInfinity) {
//             slidesNumbers += 2;
//         }

//         return {
//             width,
//             slidesNumbers
//         };
//     }

//     getInnerWidth() {
//         let { width, slidesNumbers } = this.getParams();

//         if (!width || !slidesNumbers) {
//             return null;
//         }

//         return width * slidesNumbers;
//     }

//     cloneChild(child, props = {}) {
//         if (!child) {
//             return false;
//         }

//         let { width } = this.getParams();
//         let { slide } = defaultStyles;

//         slide = {
//             ...slide,
//             width
//         };

//         return React.cloneElement(child, {
//             style: {
//                 ...slide,
//                 ...(child.props.style || {}),
//             },
//             ...props
//         });
//     }

//     getChildren() {
//         let { children, isInfinity } = this.props;

//         let clonedChildren = React.Children.map(children, this.cloneChild);

//         if (!isInfinity) {
//             return clonedChildren;
//         }

//         return [
//             this.cloneChild(clonedChildren[clonedChildren.length - 1], {key: 'clonedlast'}),
//             ...clonedChildren,
//             this.cloneChild(clonedChildren[0], {key: 'clonedfirst'})
//         ];
//     }

//     next() {
//         this.move(1);
//     }

//     prev() {
//         this.move(-1);
//     }

//     move(delta) {
//         let { onTransitionEnd, transitionDelay } = this.props;
//         let { index, isTransition } = this.state;
//         let { slidesNumbers } = this.getParams();

//         if (
//             !delta ||
//             (index === (slidesNumbers - 1) && delta > 0)
//             || (index === 0 && delta < 0)
//             || isTransition
//         ) {
//             return false;
//         }

//         index = index + delta;

//         this.setState({
//             index,
//             delta,
//             isTransition: true
//         });

//         setTimeout(() => {
//             this.setState({ isTransition: false });
//             typeof onTransitionEnd === 'function' && onTransitionEnd();
//         }, transitionDelay);
//     }

//     moveTo({ index, isTransition }) {
//         this.setState({
//             index,
//             isTransition
//         });
//     }

//     calcTransform() {
//         let { index } = this.state;
//         let { width } = this.getParams();

//         return {
//             transform: `translate3d(-${index * width}px, 0, 0)`
//         };
//     }

//     calcAnimation() {
//         const {
//             transitionTimingFunc,
//             transitionDelay
//         } = this.props;
//         const { isTransition } = this.state;

//         return isTransition ? { transition: `transform .${transitionDelay / 100}s ${transitionTimingFunc}` } : {};
//     }

//     stopAutoplay() {
//         if (this.autoplayInterval) {
//             this.autoplayInterval = clearInterval(this.autoplayInterval);
//             return true;
//         }

//         return false;
//     }

//     initAutoplay() {
//         const { autoplayDelay, transitionDelay } = this.props;

//         if (autoplayDelay < transitionDelay) {
//             throw new Error('`autoplayDelay` less than `transitionDelay`, fix it');
//         }

//         this.stopAutoplay();

//         this.autoplayInterval = setInterval(this.next, autoplayDelay);
//     }

//     render() {
//         let { className } = this.props;
//         let { isMounted } = this.state;
//         let {
//             wrapper,
//             inner
//         } = defaultStyles;
//         let innerWidth = this.getInnerWidth();
//         let transformStyles = this.calcTransform();
//         let animationStyles = this.calcAnimation();

//         return (
//             <div
//                 className={className}
//                 style={wrapper}
//                 ref={el => this.$wrapper = el}
//             >
//                 <div
//                     style={{
//                         ...inner,
//                         width: innerWidth,
//                         ...transformStyles,
//                         ...animationStyles
//                     }}
//                     ref={el => this.$inner = el}
//                 >
//                     {
//                         isMounted
//                         ? this.getChildren()
//                         : null
//                     }
//                 </div>
//             </div>
//         );
//     }
// }