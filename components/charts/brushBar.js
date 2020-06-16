import { ResponsiveContainer, BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default (props) => {
  const { title, width, height, data } = props
  return (
      <div className="bg-white rounded shadow-sm p-3 mb-4 overflow-auto">
          {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
          <div style={{width: width, height: height}}>
            <ResponsiveContainer>
              <BarChart
                height={height}
                data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                <ReferenceLine y={0} stroke="#000" />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
  )
}