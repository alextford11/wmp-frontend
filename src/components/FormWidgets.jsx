import React from 'react';
import PropTypes from 'prop-types';
import '../styles/FormWidgets.scss';
import {handleErrors} from '../utils';
import Select from 'react-select';

export class NumberInputWidget extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    initial: PropTypes.number,
    default: PropTypes.number,
    step: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.initial || props.default || 0,
      step: props.step || 1,
    }
    this.increaseValue = this.increaseValue.bind(this)
    this.decreaseValue = this.decreaseValue.bind(this)
  }

  increaseValue() {
    this.setState({
      value: this.state.value + this.state.step,
    })
  }

  decreaseValue() {
    this.setState({
      value: this.state.value - this.state.step,
    })
  }

  render() {
    return (
      <div className="number-input-widget">
        <input id={this.props.id} type="hidden" value={this.state.value}/>
        <div className="number-input-container">
          <div className="number-input-minus" onClick={() => this.decreaseValue()}>
            <span className="fa-solid fa-minus"></span>
          </div>
          <div className="number-input-value">{this.state.value}</div>
          <div className="number-input-plus" onClick={() => this.increaseValue()}>
            <span className="fa-solid fa-plus"></span>
          </div>
        </div>
      </div>
    )
  }
}

export class SelectInputWidget extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    optionsUrl: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    initial: PropTypes.string,
    styles: PropTypes.object,
    handleOnSelectChange: PropTypes.func,
    isClearable: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {options: [], selectedOption: null}
    this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
  }

  componentDidMount() {
    fetch(this.props.optionsUrl, {method: 'GET'})
      .then(handleErrors)
      .then(data => {
        const options = data['options']
        const isGrouped = 'options' in options[0]
        let selectedOption
        if (isGrouped) {
          options.forEach(group_option => {
            const filteredOptions = group_option.options.filter(option => option.value === this.props.initial)
            if (filteredOptions.length > 0) {
              selectedOption = filteredOptions[0]
            }
          })
        } else {
          selectedOption = options.filter(option => option.value === this.props.initial)[0]
        }
        this.setState({options: data['options'], selectedOption: selectedOption})
      })
  }

  handleOnSelectChange(option) {
    this.setState({selectedOption: option})
  }

  render() {
    return (
      <div>
        <input
          id={this.props.id}
          type="hidden"
          value={this.state.selectedOption && this.state.selectedOption.value || ''}/>
        <Select
          value={this.state.selectedOption}
          options={this.state.options}
          onChange={this.props.handleOnSelectChange || this.handleOnSelectChange}
          placeholder={this.props.placeholder}
          styles={this.props.styles}
          isClearable={this.props.isClearable}/>
      </div>
    )
  }
}

export class FullInput extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['text', 'number', 'email', 'password']),
    label: PropTypes.string.isRequired,
    inputOptions: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.getInputWidget = this.getInputWidget.bind(this)
  }

  getInputWidget() {
    const inputTypes = {
      number: NumberInputWidget,
      select: SelectInputWidget,
    }
    return inputTypes[this.props.type]
  }

  render() {
    const inputOptions = this.props.inputOptions || {}
    const inputWidget = React.createElement(this.getInputWidget(), inputOptions)
    return (
      <div className="form-group">
        <label htmlFor={this.props.inputOptions.id}>{this.props.label}</label>
        {inputWidget}
      </div>
    );
  }
}
