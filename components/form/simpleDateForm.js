import DatePicker from 'react-datepicker'
import { FormGroup, Label } from 'reactstrap'

export default (props) => {
    return (
        <FormGroup 
            className={`mb-3 position-relative pt-0 ${props.containerClassName ? props.containerClassName : ''}`}
            {...props.containerStyle}
        >
            {
                props.withLabel ?
                    <Label 
                        for={props.formId} 
                        className={props.labelClassName} 
                        style={{zIndex: 1, ...props.labelStyle}}
                    >
                        {props.labelName}
                    </Label> : ""
            }
            <DatePicker
                selected={props.formValue}
                onChange={props.onChange}
                dateFormat={props.formDateFormat}
                className={props.formClassName}
                ariaLabelledBy={props.formName}
                placeholderText={props.formPlaceholder}
            />
        </FormGroup>
    )
}