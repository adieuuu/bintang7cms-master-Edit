import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default (props) => {
  const { title, data, width, height } = props
  return (
    <div className="bg-white rounded shadow-sm p-3 mb-4 overflow-auto">
        {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
        <div style={{width: width, height: height}}>
          <ResponsiveContainer>
            <LineChart
              height={height}
              data={data}
              margin={{top: 10, right: 10, left: 0, bottom: 10}}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
    </div>
  )
}