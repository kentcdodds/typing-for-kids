import React from 'react'
import {render} from 'react-dom'
import {Motion, spring} from 'react-motion'

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
    if (e.target.value === this.state.currentWord) {
      this.setState({inputValue: e.target.value})
      const {completed, todo, currentWord} = this.state
      this.advanceWord({
        completed: [...completed, currentWord],
        currentWord: todo[0],
        todo: todo.slice(1),
        inputValue: '',
      })
    } else if (this.state.currentWord.startsWith(e.target.value)) {
      this.setState({inputValue: e.target.value})
    } else {
      this.nope()
    }
  }
  nope() {
    this.handleAnimateNopeFinished = () => {
      this.setState({animateNope: false})
    }
    this.setState({animateNope: true})
  }
  advanceWord(stateToSet) {
    this.handleAnimateFinishedRest = () => {
      this.setState({...stateToSet, animateFinished: false})
    }
    this.setState({
      animateFinished: true,
    })
  }
  reset = () => {
    this.setState(this.initialState)
    this.input.focus()
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
    return (
      <div>
        <h1>Typing for Becca</h1>
        <div>Let's get typing!</div>
        <div>Try typing the word:</div>
        <div>
          {animateNope ? (
            <Motion
              defaultStyle={{x: 0}}
              style={{x: spring(1)}}
              onRest={this.handleAnimateNopeFinished}
            >
              {({x}) => (
                <h2
                  style={{
                    transform: `translate(${Math.pow(Math.E, -x) *
                      Math.cos(2 * Math.PI * x) *
                      10 -
                      5}px)`,
                  }}
                >
                  {currentWord}
                </h2>
              )}
            </Motion>
          ) : (
            <h2>{currentWord}</h2>
          )}
        </div>
        <div>
          {animateFinished ? (
            <Motion
              defaultStyle={{x: 0}}
              style={{x: spring(1)}}
              onRest={this.handleAnimateFinishedRest}
            >
              {value => (
                <h2
                  style={{
                    display: 'inline-block',
                    transform: `rotate(${value.x}turn)`,
                  }}
                >
                  {inputValue}
                </h2>
              )}
            </Motion>
          ) : (
            <h2 style={{display: 'inline-block'}}>{inputValue}</h2>
          )}
        </div>
        <input
          ref={i => (this.input = i)}
          value={inputValue}
          onChange={this.handleInputChange}
        />
        <button onClick={this.reset}>Reset</button>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
