import React, { Fragment } from 'react';
import { render } from 'react-dom';

import ReactSimpleCarousel from '../src';

class TestComponent extends React.Component {
    state = {
        carousel: {},
        index: 0
    }

    next = () => {
        this.state.carousel.next();
    }

    prev = () => {
        this.state.carousel.prev();
    }

    moveTo = index => () => {
        this.state.carousel.moveTo(index);
    }

    handleMount = carousel => {
        this.setState({ carousel });
    }

    handleTransitionEnd = ({ index }) => {
        this.setState({ index });
    }

    render() {
        return (
            <Fragment>
                <Fragment>
                    <ReactSimpleCarousel
                        isInfinity
                        autoplay
                        className="carousel"
                    >
                        <div style={{height: 250, backgroundColor: 'red'}}>Slide - 1</div>
                        <div style={{height: 250, backgroundColor: 'green'}}>Slide - 2</div>
                        <div style={{height: 250, backgroundColor: 'blue'}}>Slide - 3</div>
                    </ReactSimpleCarousel>
                </Fragment>

                <h2>Carousel 2 (controls)</h2>
                <Fragment>
                    <ReactSimpleCarousel
                        isInfinity
                        className="carousel2"
                        onMount={this.handleMount}
                    >
                        <div style={{height: 250, backgroundColor: 'red'}}>Slide - 1</div>
                        <div style={{height: 250, backgroundColor: 'green'}}>Slide - 2</div>
                        <div style={{height: 250, backgroundColor: 'blue'}}>Slide - 3</div>
                    </ReactSimpleCarousel>

                    <button onClick={this.prev.bind(this)}>Prev</button>
                    <button onClick={this.next.bind(this)}>Next</button>
                </Fragment>

                <h2>Carousel 3 (pagging)</h2>
                <Fragment>
                    <ReactSimpleCarousel
                        isInfinity
                        autoplay
                        className="carousel3"
                        onTransitionEnd={this.handleTransitionEnd}
                    >
                        <div style={{height: 250, backgroundColor: 'red'}}>Slide - 1</div>
                        <div style={{height: 250, backgroundColor: 'green'}}>Slide - 2</div>
                        <div style={{height: 250, backgroundColor: 'blue'}}>Slide - 3</div>
                    </ReactSimpleCarousel>

                    <div className="pagging">
                        {
                            [1, 2, 3].map((number, n) => {
                                const style = {
                                    color: this.state.index === n ? 'red' : 'black'
                                };

                                return (
                                    <span
                                        key={n}
                                        style={style}
                                        onClick={this.moveTo(n)}
                                    >
                                        &nbsp;{ number }&nbsp;
                                    </span>
                                );
                            })
                        }
                    </div>
                </Fragment>
            </Fragment>
        );
    }
}

render(
    <TestComponent />,
    document.querySelector('#root')
);

