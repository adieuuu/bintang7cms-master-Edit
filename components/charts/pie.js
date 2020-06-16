import { ResponsiveContainer, PieChart, Pie } from 'recharts'

export default (props) => {
  const { title, width, height, data, label } = props
  return (
      <div className="bg-white rounded shadow-sm p-3 mb-4 overflow-auto">
          {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
          <div style={{width: width, height: height}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" fill="#8884d8" label={label} />
              </PieChart>
            </ResponsiveContainer>
          </div>
      </div>
  )
}