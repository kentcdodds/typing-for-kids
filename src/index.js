import React from 'react'
import {render} from 'react-dom'
import 'animate.css'
import Fireworks from './fireworks'

const inCondSandbox = true

class App extends React.Component {
  static words = ['cat', 'becca', 'dodds', 'truck', 'horse', 'love', 'kindness']
  initialState = {
    todo: App.words.slice(1),
    currentWord: App.words[0],
    completed: [],
    inputValue: '',
    animateFinished: false,
    animateNope: false,
  }
  state = this.initialState
  handleInputChange = e => {
    const fullValue = `${this.state.inputValue}${e.target.value}`
    if (this.state.inputValue === this.state.currentWord) {
      // ignore... We're animating
    } else if (this.state.currentWord.startsWith(fullValue)) {
      this.setState({inputValue: fullValue})
    } else {
      this.nope()
    }
  }
  nope() {
    this.handleAnimateNopeRest = () => {
      this.setState({animateNope: false})
    }
    this.setState({animateNope: true})
  }
  advanceIfMatches = () => {
    if (this.state.inputValue === this.state.currentWord) {
      const {completed, todo, currentWord} = this.state
      this.advanceWord({
        completed: [...completed, currentWord],
        currentWord: todo[0],
        todo: todo.slice(1),
        inputValue: '',
      })
    }
  }
  advanceWord(stateToSet) {
    this.handleAnimateFinishedRest = () => {
      this.setState({...stateToSet, animateFinished: false})
      this.input && this.input.focus()
    }
    this.setState({
      animateFinished: true,
    })
  }
  reset = () => {
    this.setState(this.initialState)
    this.input && this.input.focus()
  }
  render() {
    const {
      todo,
      currentWord,
      completed,
      inputValue,
      animateFinished,
      animateNope,
    } = this.state
    if (!currentWord) {
      return (
        <div style={{textAlign: 'center'}}>
          <h1>🎉 Congratulations! 🎊</h1>
          <div>You're done!</div>
          <div>
            <button autoFocus={!inCondSandbox} onClick={this.reset}>
              Start again
            </button>
          </div>
          <Fireworks />
        </div>
      )
    }
    return (
      <div style={{textAlign: 'center', fontSize: 30}}>
        <h1>Typing for Becca</h1>
        <div>Let's get typing!</div>
        <div>Try typing the word:</div>
        <div
          style={{
            width: 250,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
            textAlign: 'left',
          }}
        >
          <h2>
            <Animated
              onRest={this.handleAnimateNopeRest}
              animation={
                animateNope ? (
                  'headShake'
                ) : animateFinished ? (
                  getRandomOutAnimation()
                ) : (
                  ''
                )
              }
              style={{marginLeft: 10}}
            >
              <span style={{color: 'blue'}}>{inputValue}</span>
              {currentWord.slice(inputValue.length)}
            </Animated>
          </h2>
          <div
            style={{
              border: '1px solid',
              padding: 10,
              display: 'flex',
            }}
            onClick={() => this.input.focus()}
          >
            <h2 style={{display: 'inline-block', margin: 0}}>
              {animateFinished ? (
                <Animated
                  onRest={this.handleAnimateFinishedRest}
                  animation={getRandomOutAnimation()}
                  style={{display: 'inline-block'}}
                >
                  {inputValue}
                </Animated>
              ) : (
                inputValue.split('').map((c, i) => (
                  <InputChar key={i} onRest={this.advanceIfMatches}>
                    {c}
                  </InputChar>
                ))
              )}
            </h2>
            <input
              value={''}
              autoFocus={!inCondSandbox}
              ref={i => (this.input = i)}
              onChange={this.handleInputChange}
              style={{
                flex: 1,
                width: '100%',
                border: 'none',
                fontSize: '1.5em',
                outline: 'none',
              }}
            />
          </div>
        </div>
        <button onClick={this.reset}>Start Over</button>
      </div>
    )
  }
}

class InputChar extends React.Component {
  animation = getRandomInAnimation()
  render() {
    return (
      <Animated
        style={{display: 'inline-block'}}
        animation={this.animation}
        {...this.props}
      />
    )
  }
}

function getRandomOutAnimation() {
  const outAnimations = [
    'bounceOut',
    'bounceOutDown',
    'bounceOutLeft',
    'bounceOutRight',
    'bounceOutUp',
    'fadeOut',
    'fadeOutDown',
    'fadeOutLeft',
    'fadeOutRight',
    'fadeOutUp',
    'flipOutX',
    'flipOutY',
    'hinge',
    'lightSpeedOut',
    'rollOut',
    'rotateOut',
    'rotateOutDownLeft',
    'rotateOutDownRight',
    'rotateOutUpLeft',
    'rotateOutUpRight',
    'slideOutDown',
    'slideOutLeft',
    'slideOutRight',
    'slideOutUp',
    'zoomOut',
    'zoomOutDown',
    'zoomOutLeft',
    'zoomOutRight',
    'zoomOutUp',
  ]
  return outAnimations[Math.floor(Math.random() * outAnimations.length)]
}

function getRandomInAnimation() {
  const inAnimations = [
    'fadeIn',
    'fadeInDown',
    'fadeInLeft',
    'fadeInRight',
    'fadeInUp',
    'flipInX',
    'flipInY',
    'jackInTheBox',
    'lightSpeedIn',
    'rollIn',
    'rotateIn',
    'rotateInDownLeft',
    'rotateInDownRight',
    'rotateInUpLeft',
    'rotateInUpRight',
    'slideInDown',
    'slideInLeft',
    'slideInRight',
    'slideInUp',
    'zoomIn',
  ]
  return inAnimations[Math.floor(Math.random() * inAnimations.length)]
}

class Animated extends React.Component {
  static defaultProps = {
    onRest: () => {},
  }
  componentDidMount() {
    this.div.addEventListener('animationend', () => {
      this.props.onRest()
    })
  }
  render() {
    const {onRest, animation, ...rest} = this.props
    return (
      <div
        className={`animated ${animation}`}
        ref={div => (this.div = div)}
        {...rest}
      />
    )
  }
}
render(<App />, document.getElementById('root'))
