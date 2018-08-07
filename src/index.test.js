import React from 'react';
import toJson from 'enzyme-to-json';

import Carousel from './index';

/* global mount, jest */
describe('<Carousel />', () => {
    const slide = <div style={{height: 250, width: 500}}>Slide</div>;

    it('should render wrapper', () => {
        const wrapper = mount(<Carousel className="c-carousel" />);

        expect(wrapper.find('div.c-carousel').exists()).toBeTruthy();
        wrapper.unmount();
    });

    it('should render inner div', () => {
        const wrapper = mount(<Carousel innerClassName="c-carousel__inner">{ slide }</Carousel>);

        expect(wrapper.find('div.c-carousel__inner').exists()).toBeTruthy();
        wrapper.unmount();
    });

    it('should render slides', () => {
        const wrapper = mount(
            <Carousel
                innerClassName="c-carousel__inner"
            >
                { slide }
                { slide }
            </Carousel>
        );

        expect(wrapper.find('div.c-carousel__inner').children().length).toBe(2);
        wrapper.unmount();
    });

    it('should call `onMount`', () => {
        const handleMount = jest.fn();
        const wrapper = mount(
            <Carousel
                className="c-carousel"
                onMount={handleMount}
            >
                { slide }
                { slide }
            </Carousel>
        );

        expect(handleMount).toBeCalled();
        wrapper.unmount();
    });

    it('should move slides with `isInfinity` mode', () => {
        let carousel;
        const handleMount = jest.fn(c => carousel = c);
        const wrapper = mount(
            <Carousel
                isInfinity
                className="c-carousel"
                innerClassName="c-carousel__inner"
                onMount={handleMount}
            >
                { slide }
                { slide }
                { slide }
            </Carousel>
        );
        const moveSlide = () => {
            carousel.next();
            wrapper.find('.c-carousel__inner').simulate('transitionend');
            wrapper.update();
        };

        expect(wrapper.state('realIndex')).toBe(0);
        moveSlide();

        expect(wrapper.state('realIndex')).toBe(1);
        moveSlide();

        expect(wrapper.state('realIndex')).toBe(2);

        moveSlide();
        expect(wrapper.state('realIndex')).toBe(0);
    });

    it('should move slides without `isInfinity` mode', () => {
        let carousel;
        const handleMount = jest.fn(c => carousel = c);
        const wrapper = mount(
            <Carousel
                className="c-carousel"
                innerClassName="c-carousel__inner"
                onMount={handleMount}
            >
                { slide }
                { slide }
                { slide }
            </Carousel>
        );
        const moveSlide = () => {
            carousel.next();
            wrapper.find('.c-carousel__inner').simulate('transitionend');
            wrapper.update();
        };

        expect(wrapper.state('realIndex')).toBe(0);
        moveSlide();

        expect(wrapper.state('realIndex')).toBe(1);
        moveSlide();

        expect(wrapper.state('realIndex')).toBe(2);

        moveSlide();
        expect(wrapper.state('realIndex')).toBe(2);
    });

    it('should matches the snapshot', () => {
        const wrapper = mount(
            <Carousel
                isInfinity
                className="c-carousel"
                innerClassName="c-carousel__inner"
            >
                { slide }
                { slide }
                { slide }
            </Carousel>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
