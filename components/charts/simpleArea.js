import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default (props) => {
  const { title, width, height, data } = props
  return (
      <div className="bg-white rounded shadow-sm p-3 mb-4 overflow-auto">
          {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
          <div style={{width: width, height: height}}>
            <ResponsiveContainer>
              <AreaChart
                height={height}
                data={data}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>
  )
}