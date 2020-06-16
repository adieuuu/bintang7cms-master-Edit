import Select from 'react-select/creatable'
import { FormGroup, Label } from 'reactstrap'
import MarkerCard from '../cards/MarkerCard'

export default (props) => {
    let newOptions = props.formOptionData.map((data, key) => {
        return { 
            value: data.value, 
            label:  <div key={key} className="position-relative d-flex">
                        <MarkerCard style={{width: "40px", height: "40px"}} imagePath={data.imageUrl} />
                        <div style={{paddingLeft: "7px", paddingTop: "10px"}}>{data.label}</div>
                    </div> 
        }
    })
    return (
        
        <FormGroup 
            className={`mb-3 position-relative ${props.containerClassName ? props.containerClassName : ''}`}
            style={props.containerStyle}
        >
            {
                props.withLabel ?
                    <Label 
                        for={props.formId} 
                        className={props.labelClassName} 
                        style={props.labelStyle}
                    >
                        {props.labelName}
                    </Label> : ""
            }
            <Select
                closeMenuOnSelect={true}
                className="sectionMarker"
                defaultValue={props.formValue}
                options={newOptions}
                isMulti={props.multi ? props.multi : false}
                styles={{
                    input: base => ({
                      ...base,
                      ...props.formStyle
                    })
                }}
            />
        </FormGroup>
    )
}