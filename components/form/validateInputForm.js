import { AvField } from 'availity-reactstrap-validation'
import { FormGroup, Label } from 'reactstrap'

export default (props) => {
    return (
        <FormGroup 
            className={`position-relative ${props.containerClassName ? props.containerClassName : ''}`}
            {...props.containerStyle}
        >
            {
                props.withLabel ?
                <Label for={props.formId} className={`${props.labelClassName} validated`}>{props.labelName}</Label> : ""
            }
            <AvField 
                className={props.formClassName} 
                id={props.formId} 
                type={props.formType} 
                name={props.formName} 
                placeholder={props.formPlaceholder} 
                onChange={props.onChange} 
                errorMessage={props.formErrorMessage} 
                validate={props.formValidate} 
                related={props.formRelation}
                value={props.formValue}
                bsSize={props.formSize}
                readOnly={props.formReadOnly ? props.formReadOnly : false}
                disabled={props.formDisabled ? props.formDisabled : false}
                style={{
                    ...props.formStyle,
                    minHeight: props.formType === 'textarea' ? '100px' : 'auto'
                }}
            />
            {props.children}
        </FormGroup>
    )
}