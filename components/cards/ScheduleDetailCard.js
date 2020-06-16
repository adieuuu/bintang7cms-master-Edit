import { Badge, Button } from 'reactstrap'
import { Draggable } from 'react-beautiful-dnd'

export default (props) => {
  console.log('props', props)
  const { schedule, index, onRemove } = props
  return (
    <Draggable
      draggableId={index}
      index={index}
    >
      {provided => (
        <div
          className="mr-2 mt-2 w-100" 
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Badge 
            color="dark" 
            className="py-1 px-2 font-20" 
            style={{lineHeight: 1.7}}
          >
            <span className="d-inline-block">{schedule.time}</span>
            <Button 
              color="danger" 
              style={{lineHeight: 1, marginTop: "-4px"}} 
              className="rounded-lg p-1 ml-2" 
              onClick={onRemove(index)}
            >
              <i className="icon-x font-18" />
            </Button>
          </Badge>
        </div>
      )}
    </Draggable>
  )
}