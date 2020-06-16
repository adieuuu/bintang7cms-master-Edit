import { AvField } from 'availity-reactstrap-validation'
import { FormGroup, Label } from 'reactstrap'

export default (props) => {
    return (
        <FormGroup 
            className={`position-relative pt-0 ${props.containerClassName ? props.containerClassName : ''}`}
            {...props.containerStyle}
        >
            {
                props.withLabel ?
                <Label for={props.formId} className={`${props.labelClassName} validated`}>{props.labelName}</Label> : ""
            }
            <AvField 
                type="select"
                name={props.formName} 
                value={props.formValue}
                className={props.formClassName} 
                bsSize={props.formSize}
                onChange={props.onChange}
                errorMessage={props.formErrorMessage} 
                disabled={props.disabled}
                required
            >
                {props.formPlaceholder ? <option key={0} value={0} hidden>{props.formPlaceholder}</option> : ""}
                {props.formOptionData.map((data) => <option key={data.id} value={data.id}>{data.name}</option>)}
            </AvField>
        </FormGroup>
    )
}