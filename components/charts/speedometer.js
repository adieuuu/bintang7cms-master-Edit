import React from 'react'
import ReactSpeedometer from "react-d3-speedometer"
import { SizeMe } from 'react-sizeme'

export default (props) => {
  const { title, height, data } = props
  return (
    <div className="bg-white rounded shadow-sm py-3 px-4 mb-4 overflow-auto">
        {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
        <div className="d-block w-100 position-relative" style={{height: height}}>
          <SizeMe>
            {
              ({ size }) => {
                return (
                  <div className="absolute-center text-center w-100" style={{height: `${Math.abs(size.width)*0.6}px`}}>
                    <ReactSpeedometer 
                      height={Math.abs(size.width)*0.7}
                      ringWidth={15} 
                      forceRender={true}
                      needleHeightRatio={0.8}
                      needleColor="#8884d8"
                      needleTransition="easeBackInOut"
                      needleTransitionDuration={1000}
                      startColor="#82ca9d"
                      segments={10}
                      endColor="red"
                      textColor="black"
                      fluidWidth={true}
                      width={Math.abs(size.width)}
                      {...data} 
                    />
                  </div>
                )
              }
            }
          </SizeMe>
        </div>
    </div>
  )
}