import Slider from "react-slick"
import styled from 'styled-components'

const SwiperItems = styled.img`
    width: 100%;
    height: auto;
`
const SwiperDotWrapper = styled.ul`
    text-align: center;
    background-color: transparent;
    width: 100%;
    height: 20px;

    li {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 0;
        padding: 10px;

        span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            margin: 0;
            padding: 0;
            background-color: #CCCCCC;
            border-radius: 50%;
        }
        &.slick-active {
            padding: 10px 5px;

            span {
                width: 25px;
                border-radius: 6px;
                background-color: #23F182 !important;
            }
        }
    }
`

export default (props) => {
    const { datas, style } = props
    const settings = datas ? {
            dots: datas.length > 1 ? true : false,
            arrows: false,
            infinite: true,
            lazyLoad: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            appendDots: dots => <SwiperDotWrapper>{dots}</SwiperDotWrapper>,
            customPaging: i => <span />
        } : null
    
    return (
        datas ?
            <div 
                className="relative d-inline-block w-100 overflow-hidden" 
                style={
                    datas.length > 1 ? { paddingBottom: "25px", ...style } : ""
                }
            >
                <Slider {...settings}>
                    {
                        datas.map((data, key) => (
                            <div className="d-inline-block w-100" key={key}>
                                <SwiperItems src={data.picture} alt={data.title} />
                            </div>
                        ))
                    }
                </Slider>
            </div> : ""
    )
}