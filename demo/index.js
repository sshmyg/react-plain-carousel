import React from 'react';
import { render } from 'react-dom';

import ReactSimpleCarousel from '../src';

class TestComponent extends React.Component {
    next() {
        this.refs.carousel.next();
    }

    prev() {
        this.refs.carousel.prev();
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <ReactSimpleCarousel
                    className="carousel"
                    ref="carousel"
                    isInfinity={true}
                    autoplay={true}
                    autoplayDelay={5000}
                >
                    <div style={{height: 250, backgroundColor: 'red'}}>Slide - 1</div>
                    <div style={{height: 250, backgroundColor: 'green'}}>Slide - 2</div>
                    <div style={{height: 250, backgroundColor: 'blue'}}>Slide - 3</div>
                </ReactSimpleCarousel>

                <button onClick={this.prev.bind(this)}>Prev</button>
                <button onClick={this.next.bind(this)}>Next</button>
            </div>
        );
    }
}


render(
    <TestComponent />,
    document.querySelector('#root')
);

