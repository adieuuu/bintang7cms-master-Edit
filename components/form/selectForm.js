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
                type="select"
                className={props.formClassName} 
                style={props.fromStyle}
                name={props.formName}   
                id={props.formId} 
                value={props.formValue}
                onChange={props.onChange}
                related={props.formRelation}
                bsSize={props.formSize}
                disabled={props.disabled}
            >
                {
                    props.formPlaceholder ?
                    <option key="" value="" readOnly hidden>{props.formPlaceholder}</option> : ""
                }
                {
                    props.formOptionData.map((data, key) => <option key={key} value={data.id}>{data.name}</option>)
                }
            </Input>
        </FormGroup>
    )
}