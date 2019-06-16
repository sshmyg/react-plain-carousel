import t,{Component as e,Children as n,createRef as i}from"react";function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var l={overflow:"hidden"},h={overflow:"hidden"},c={float:"left"},d=function(d){function f(){var t,e,r,s=arguments;!function(t,e){if(!(t instanceof f))throw new TypeError("Cannot call a class as a function")}(this);for(var l=arguments.length,h=new Array(l),c=0;c<l;c++)h[c]=s[c];e=!(r=(t=a(f)).call.apply(t,[this].concat(h)))||"object"!=typeof r&&"function"!=typeof r?u(this):r,o(u(e),"autoplayInterval",void 0),o(u(e),"touchStart",{}),o(u(e),"touchMove",{}),o(u(e),"isLongTouch",!1),e.handleTransitionEnd=e.handleTransitionEnd.bind(u(e)),e.handleResize=e.handleResize.bind(u(e)),e.handleTouchEnd=e.handleTouchEnd.bind(u(e)),e.handleTouchMove=e.handleTouchMove.bind(u(e)),e.handleTouchStart=e.handleTouchStart.bind(u(e)),e.cloneChild=e.cloneChild.bind(u(e));var d=n.count(e.props.children),p=e.props.isInfinity&&d>1;return e.wrapperRef=i(),e.state={isMounted:!1,customTransform:void 0,realIndex:0,index:p?1:0,isInfinity:p,slidesNumbers:p?d+2:d,isTransition:!1,isTransitionInProgress:!1},e}var p;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(f,e),(p=[{key:"componentDidMount",value:function(){var t=this,e=this.props.onMount;this.$wrapper=this.wrapperRef.current,this.setState({width:this.getWrapperWidth(),isMounted:!0}),this.initAutoplay(),window.addEventListener("resize",this.handleResize),e({next:function(){return t.move(1)},prev:function(){return t.move(-1)},moveTo:function(e){return"number"==typeof e?t.moveTo({index:e+1}):void 0}})}},{key:"componentDidUpdate",value:function(t,e){var n=this,i=this.state,o=i.index,r=i.isInfinity,a=i.slidesNumbers,s=i.isTransitionInProgress;r||o!==a-1||s||this.stopAutoplay(),r&&(0===o&&e.isTransitionInProgress&&!s&&setTimeout(function(){n.moveTo({index:a-2,isTransition:!1,isTransitionInProgress:!1})},17),a-1===o&&e.isTransitionInProgress&&!s&&setTimeout(function(){n.moveTo({index:1,isTransition:!1,isTransitionInProgress:!1})},17))}},{key:"componentWillUnmount",value:function(){this.stopAutoplay(),window.removeEventListener("resize",this.handleResize)}},{key:"getWrapperWidth",value:function(){return this.$wrapper&&this.$wrapper.clientWidth}},{key:"getInnerWidth",value:function(){var t=this.state,e=t.width,n=t.slidesNumbers;return e&&n?e*n:null}},{key:"cloneChild",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)return!1;var i=r({},c,{width:this.state.width});return t.cloneElement(e,r({style:r({},i,e.props.style||{})},n))}},{key:"getChildren",value:function(){var t,e=this.state.isInfinity,i=n.map(this.props.children,this.cloneChild);return e?[this.cloneChild(i[i.length-1],{key:"clonedlast"})].concat(function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t=i)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}(),[this.cloneChild(i[0],{key:"clonedfirst"})]):i}},{key:"move",value:function(t){var e=this.state,n=e.index;if(!t||n===e.slidesNumbers-1&&t>0||0===n&&t<0||e.isTransitionInProgress)return!1;this.moveTo({index:n+t,customTransform:void 0})}},{key:"moveTo",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.initAutoplay(),this.setState(function(){return r({isTransition:!0,isTransitionInProgress:!0},t)})}},{key:"getRealIndex",value:function(){var t=this.state,e=t.index;return t.isInfinity?t.slidesNumbers-1===e?0:e-1:e}},{key:"calcTransform",value:function(t){var e=this.state;return t=t||e.index*e.width,{transform:"translate3d(".concat(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"-").concat(t,"px, 0, 0)")}}},{key:"calcAnimation",value:function(){var t=this.props,e=t.transitionTimingFunc,n=this.state.isTransition,i=t.transitionDelay/100;return i<1e3&&(i=".".concat(i)),n?{transition:"transform ".concat(i,"s ").concat(e)}:{}}},{key:"stopAutoplay",value:function(){this.autoplayInterval=this.autoplayInterval?clearInterval(this.autoplayInterval):this.autoplayInterval}},{key:"initAutoplay",value:function(){var t=this,e=this.props,n=e.autoplayDelay;if(!e.autoplay||this.state.slidesNumbers<=1)return!1;if(n<e.transitionDelay)throw new Error("`autoplayDelay` less than `transitionDelay`, fix it");this.stopAutoplay(),this.autoplayInterval=setInterval(function(){return t.move(1)},n)}},{key:"handleTouchStart",value:function(t){var e=this,n=t.touches;setTimeout(function(){e.isLongTouch=!0},250),this.touchStart={x:n[0].pageX,y:n[0].pageY,time:+new Date}}},{key:"handleTouchMove",value:function(t){var e=t.touches,n=t.scale,i=this.state,o=i.index,r=i.width;if(!(e.length>1||n&&1!==n)){var a=e[0].pageX;this.touchMove={x:a,y:e[0].pageY,time:+new Date,deltaX:o*r+(this.touchStart.x-a)},this.setState({customTransform:this.touchMove.deltaX,isTransition:!1})}}},{key:"handleTouchEnd",value:function(){var t=this.state,e=t.index,n=t.isInfinity,i=t.width,o=t.slidesNumbers,r=this.touchMove.deltaX,a=Math.abs(e*i-r),s=o-(e+1)==0,u=r>e*i?1:-1,l=function(){return{customTransform:void 0,isTransition:!0}};n?!this.isLongTouch||a>i/2?this.move(u):this.setState(l):!this.isLongTouch||a>i/2?s&&1===u?this.setState(l):this.move(u):this.setState(l),this.touchStart={},this.touchMove={},this.isLongTouch=!1}},{key:"handleResize",value:function(){this.setState({width:this.getWrapperWidth()})}},{key:"handleTransitionEnd",value:function(){var t=this.props.onTransitionEnd,e=this.getRealIndex();this.setState({isTransitionInProgress:!1,realIndex:e}),"function"==typeof t&&t({index:e})}},{key:"render",value:function(){var e=this.props,n=e.className,i=e.innerClassName,o=this.state,a=o.customTransform,s=l,u=h,c=o.isMounted?this.getChildren():null,d=this.getInnerWidth(),f=this.calcTransform(a),p=this.calcAnimation();return t.createElement("div",{className:n,style:s,onTouchStart:this.handleTouchStart,onTouchMove:this.handleTouchMove,onTouchEnd:this.handleTouchEnd,ref:this.wrapperRef},t.createElement("div",{style:r({},u,{width:d},f,p),className:i,onTransitionEnd:this.handleTransitionEnd},c))}}])&&function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(f.prototype,p),f}();o(d,"defaultProps",{isInfinity:!1,autoplay:!1,autoplayDelay:5e3,transitionTimingFunc:"ease",transitionDelay:500,onTransitionEnd:void 0,className:"",innerClassName:"",children:void 0,onMount:function(){}});export default d;
