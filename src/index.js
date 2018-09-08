import React from 'react'
import { render } from 'react-dom'
import 'animate.css'
import Fireworks from './fireworks'
import registerServiceWorker from './register-service-worker'

registerServiceWorker()

// don't autofocus in codesandbox
const inCodeSandbox = location.href.includes('codesandbox.io')

const getWords = () =>
  shuffle([
    // always have these words
    'becca',
    'nathan',
    'adam',
    'michael',
    'mom',
    'dad',
    'dodds',
    'love',
    'family',
    ...shuffle(
      // have only some these words at random
      [
        'cat',
        'hat',
        'bat',
        'truck',
        'horse',
        'kindness',
        'nice',
        'friend',
        'dog',
        'happy',
        'sad',
        'glad',
        'seal',
        'good',
        'fast',
        'slow',
        'rabbit',
        'turtle',
        'snake',
        'shark',
        'cow',
      ],
    ).slice(0, 8),
  ])

class App extends React.Component {
  getInitialState() {
    const words = getWords()
    return {
      todo: words.slice(1),
      currentWord: words[0],
      completed: [],
      inputValue: '',
      animateFinished: false,
      animateNope: false,
    }
  }
  state = this.getInitialState()
  handleInputChange = e => {
    const fullValue = `${this.state.inputValue}${e.target.value.toLowerCase()}`
    if (this.state.inputValue === this.state.currentWord) {
      // ignore... We're animating
    } else if (this.state.currentWord.startsWith(fullValue)) {
      this.setState({ inputValue: fullValue })
    } else {
      this.nope()
    }
  }
  nope() {
    this.handleAnimateNopeRest = () => {
      this.setState({ animateNope: false })
    }
    this.setState({ animateNope: true })
  }
  advanceIfMatches = () => {
    if (this.state.inputValue.toLowerCase() === this.state.currentWord) {
      const { completed, todo, currentWord } = this.state
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
      this.setState({ ...stateToSet, animateFinished: false })
      this.input && this.input.focus()
    }
    this.setState({
      animateFinished: true,
    })
  }
  reset = () => {
    this.setState(this.getInitialState())
    this.input && this.input.focus()
  }
  render() {
    const { currentWord, inputValue, animateFinished, animateNope } = this.state
    if (!currentWord) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1>
            <span role="img" aria-label="tada">
              🎉
            </span>{' '}
            Congratulations!{' '}
            <span role="img" aria-label="confetti">
              🎊
            </span>
          </h1>
          <div>You're done!</div>
          <div>
            <button
              autoFocus={!inCodeSandbox}
              onClick={this.reset}
              style={{ fontSize: 20 }}
            >
              <span role="img" aria-label="repeat">
                🔁
              </span>{' '}
              Start again
            </button>
          </div>
          <Fireworks />
        </div>
      )
    }
    return (
      <div style={{ textAlign: 'center', fontSize: 30 }}>
        <h1>Typing for Kids</h1>
        <div>Let's get typing!</div>
        <div>Try typing the word:</div>
        <div
          style={{
            width: 250,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
            textAlign: 'left',
            textTransform: 'uppercase',
          }}
        >
          <h2>
            <Animated
              onRest={this.handleAnimateNopeRest}
              animation={
                animateNope
                  ? 'headShake'
                  : animateFinished
                    ? getRandomOutAnimation()
                    : ''
              }
              style={{ marginLeft: 10 }}
            >
              <span style={{ color: 'blue' }}>{inputValue}</span>
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
            <h2 style={{ display: 'inline-block', margin: 0 }}>
              {animateFinished ? (
                <Animated
                  onRest={this.handleAnimateFinishedRest}
                  animation={getRandomOutAnimation()}
                  style={{ display: 'inline-block' }}
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
              autoFocus={!inCodeSandbox}
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
        <button onClick={this.reset} style={{ fontSize: 20 }}>
          <span role="img" aria-label="repeat">
            🔁
          </span>{' '}
          Start Over
        </button>
      </div>
    )
  }
}

class InputChar extends React.Component {
  animation = getRandomInAnimation()
  render() {
    return (
      <Animated
        style={{ display: 'inline-block' }}
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
    const { onRest, animation, ...rest } = this.props
    return (
      <div
        className={`animated ${animation}`}
        ref={div => (this.div = div)}
        {...rest}
      />
    )
  }
}

function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

render(<App />, document.getElementById('root'))

/* eslint no-restricted-globals: "off" */
