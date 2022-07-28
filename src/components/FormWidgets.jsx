import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../styles/FormWidgets.scss';
import {handleErrors} from '../utils';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import {Alert} from 'react-bootstrap';

export function NumberInputWidget(props) {
  const [value, setValue] = useState(props.initial || props.default || 0)
  const step = useState(props.step || 1)[0]

  function increaseValue() {
    setValue(value + step)
  }

  function decreaseValue() {
    setValue(value - step)
  }

  function handleOnChange(event) {
    setValue(event.target.value)
  }

  function getInputWidth(value) {
    return Math.max(value.toString().length * 0.6, 2.5) + 'rem'
  }

  function handleOnInput(event) {
    event.target.parentNode.style.width = getInputWidth(event.target.value)
  }

  return (
    <div className="number-input-widget">
      <div className="number-input-container">
        <div className="number-input-minus" onClick={() => decreaseValue()}>
          <span className="fa-solid fa-minus"></span>
        </div>
        <div className="number-input-value">
          <input
            id={props.id}
            type="number"
            value={value}
            onChange={handleOnChange}
            onInput={handleOnInput}
            style={{width: getInputWidth(value)}}/>
        </div>
        <div className="number-input-plus" onClick={() => increaseValue()}>
          <span className="fa-solid fa-plus"></span>
        </div>
      </div>
    </div>
  )
}

NumberInputWidget.propTypes = {
  id: PropTypes.string.isRequired,
  initial: PropTypes.number,
  default: PropTypes.number,
  step: PropTypes.number,
}

export function SelectInputWidget(props) {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    if (Object.keys(options).length > 1) {
      return
    }

    fetch(props.optionsUrl, {method: 'GET'})
      .then(handleErrors)
      .then(data => {
        const options = data['options']
        const isGrouped = options[0] && 'options' in options[0]
        let selectedOption
        if (isGrouped) {
          options.forEach(group_option => {
            const filteredOptions = group_option.options.filter(option => option.value === props.initial)
            if (filteredOptions.length > 0) {
              selectedOption = filteredOptions[0]
            }
          })
        } else {
          selectedOption = options.filter(option => option.value === props.initial)[0]
        }
        setOptions(data['options'])
        setSelectedOption(selectedOption)
      })
  })

  function handleOnSelectChange(option) {
    setSelectedOption(option)
  }

  return (
    <div>
      <input
        id={props.id}
        type="hidden"
        value={selectedOption && selectedOption.value || ''}/>
      <Select
        value={selectedOption}
        options={options}
        onChange={props.handleOnSelectChange || handleOnSelectChange}
        placeholder={props.placeholder}
        styles={props.styles}
        isClearable={props.isClearable}/>
    </div>
  )
}

SelectInputWidget.propTypes = {
  id: PropTypes.string.isRequired,
  optionsUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  initial: PropTypes.string,
  styles: PropTypes.object,
  handleOnSelectChange: PropTypes.func,
  isClearable: PropTypes.bool,
}

export function TextInputWidget(props) {
  const [value, setValue] = useState(props.initial || '')
  const input_type = props.input_type || 'text'

  function handleOnChange(event) {
    setValue(event.target.value)
  }

  return (
    <div>
      <input
        id={props.id}
        className="form-control"
        type={input_type}
        value={value}
        onChange={handleOnChange}
        placeholder={props.placeholder}/>
    </div>
  )
}

TextInputWidget.propTypes = {
  id: PropTypes.string.isRequired,
  initial: PropTypes.string,
  placeholder: PropTypes.string,
  input_type: PropTypes.string
}

export function EmailInputWidget(props) {
  return TextInputWidget({...props, input_type: 'email'})
}

export function PasswordInputWidget(props) {
  return TextInputWidget({...props, input_type: 'password'})
}

export function InputLabel(props) {
  return (
    <label htmlFor={props.id}>
      {props.label}
      {props.tooltip &&
        (
          <span>
            <span className="fa-solid fa-circle-info ms-2" data-tip="" data-for={props.id + '_tooltip'}></span>
            <ReactTooltip id={props.id + '_tooltip'} effect='solid'>
              {props.tooltip}
            </ReactTooltip>
          </span>
        )
      }
    </label>
  )
}

InputLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
}

export function FullInput(props) {
  function getInputWidget() {
    const inputTypes = {
      number: NumberInputWidget,
      select: SelectInputWidget,
      text: TextInputWidget,
      email: EmailInputWidget,
      password: PasswordInputWidget,
    }
    return inputTypes[props.type]
  }

  const inputOptions = props.inputOptions || {}
  const inputWidget = React.createElement(getInputWidget(), inputOptions)
  return (
    <div className="form-group">
      <InputLabel id={props.inputOptions.id} label={props.label} tooltip={props.tooltip}/>
      {inputWidget}
    </div>
  )
}

FullInput.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'email', 'password']),
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  inputOptions: PropTypes.object,
}

export function FormErrorMessage(props) {
  return (
    <Alert variant={'danger'}>{props.error}</Alert>
  )
}

FormErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
}
