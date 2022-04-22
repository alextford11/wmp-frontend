import React from 'react';
import PropTypes from 'prop-types';
import '../styles/FormWidgets.scss';

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

  getInputWidget () {
    const inputTypes = {
      number: NumberInputWidget,
    }
    return inputTypes[this.props.type]
  }

  render () {
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

  increaseValue () {
    this.setState({
      value: this.state.value + this.state.step,
    })
  }

  decreaseValue () {
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
