import { ResponsiveContainer, PieChart, Pie } from 'recharts'

export default (props) => {
  const { title, width, height, data, label } = props
  return (
      <div className="bg-white rounded shadow-sm p-3 mb-4 overflow-auto">
          {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
          <div style={{width: width, height: height}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.data01} dataKey="value" outerRadius={60} fill="#8884d8" />
                <Pie data={data.data02} dataKey="value" innerRadius={70} outerRadius={90} fill="#82ca9d" label={label} />
              </PieChart>
            </ResponsiveContainer>
          </div>
      </div>
  )
}