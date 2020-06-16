import { FormGroup, Label, Input } from 'reactstrap'

export default (props) => {
    return (
        <FormGroup 
            className={`position-relative ${props.containerClassName ? props.containerClassName : ''}`}
            {...props.containerStyle}
        >
            {
                props.withLabel ?
                <Label for={props.formId} className={props.labelClassName}>{props.labelName}</Label> : ""
            }
            <Input 
                className={props.formClassName} 
                style={props.formStyle}
                id={props.formId} 
                type={props.formType} 
                name={props.formName} 
                placeholder={props.formPlaceholder} 
                onChange={props.onChange} 
                related={props.formRelation}
                value={props.formValue}
                bsSize={props.formSize}
                readOnly={props.formReadOnly ? props.formReadOnly : false}
                onKeyPress={props.onKeyPress}
                disabled={props.disabled}
            />
            {props.children}
        </FormGroup>
    )
}