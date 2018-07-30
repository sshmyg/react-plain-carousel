import React, { Fragment } from 'react';
import { render } from 'react-dom';

import ReactSimpleCarousel from '../src';

class TestComponent extends React.Component {
    state = {
        carousel: {}
    }

    next = () => {
        this.state.carousel.next();
    }

    prev = () => {
        this.state.carousel.prev();
    }

    handleMount = carousel => {
        this.setState({ carousel });
    }

    render() {
        return (
            <Fragment>
                <ReactSimpleCarousel
                    className="carousel"
                    isInfinity={true}
                    autoplay={true}
                    autoplayDelay={5000}
                    onMount={this.handleMount}
                >
                    <div style={{height: 250, backgroundColor: 'red'}}>Slide - 1</div>
                    <div style={{height: 250, backgroundColor: 'green'}}>Slide - 2</div>
                    <div style={{height: 250, backgroundColor: 'blue'}}>Slide - 3</div>
                </ReactSimpleCarousel>

                <button onClick={this.prev.bind(this)}>Prev</button>
                <button onClick={this.next.bind(this)}>Next</button>
            </Fragment>
        );
    }
}


render(
    <TestComponent />,
    document.querySelector('#root')
);

