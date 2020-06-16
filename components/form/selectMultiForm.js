import CreatableSelect from 'react-select/creatable'
import { FormGroup, Label } from 'reactstrap'

export default (props) => {
    const maxOptions = props.maxValue ? props.maxValue : props.isMulti ? 1 : 5
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
            <CreatableSelect
                isMulti={props.multi ? props.multi : false}
                closeMenuOnSelect={props.closeOnSelect}
                blurInputOnSelect={props.closeOnSelect}
                instanceId={props.formId}
                className={props.formClassName}
                name={props.formName}
                placeholder={props.formPlaceholder}
                onChange={props.onChange}
                style={props.formStyle}
                options={props.formValue && props.formValue.length === maxOptions ? [] : props.formOptionData}
                styles={{
                    input: base => ({...base, ...props.formStyle})
                }}
                noOptionsMessage={() => {
                    return props.formValue && props.formValue.length === maxOptions ? `You've reached the maximum options value` : `No options available`
                }}
                value={props.formValue}
            />
        </FormGroup>
    )
}