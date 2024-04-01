import React from "react";
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {

  const [dice, setDice] = React.useState(allNewDice(10));

  const [tenzies, setTenzies] = React.useState(false);

  const [rolls, setRolls] = React.useState(0);

  const [bestScore, setBestScore] = React.useState(localStorage.getItem("score") || 999)

  const [scoreCheck, setScoreCheck] = React.useState(true)

  React.useEffect(() => {
    const allHeld  = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true)
      setScoreCheck(prev => !prev)
    }
  }, [dice])

  React.useEffect(() => {
    if (rolls > 0 && rolls < bestScore) {
      setBestScore(rolls)
      localStorage.setItem("score", rolls)
    }
  },[scoreCheck])

  React.useEffect(() => {
    localStorage.setItem("score", bestScore)
  },[bestScore])
  
  const dieElements = dice.map((die) =>
  <Die
    key={die.id}
    id={die.id}
    value={die.value}
    isHeld={die.isHeld}
    holdDice={() => {holdDice(die.id)}}
  />
  )

  function allNewDice(num) {
    const diceArray = [];
    for (let i = 0; i < num; i++) {
      const newNum = Math.ceil((Math.random() * 6));
      diceArray.push({
        value: newNum,
        isHeld: false,
        id: nanoid()
      });
    }
    return(diceArray);
  }

  function rollDice() {
    if (!tenzies) {
      setRolls(prev => prev + 1)
      setDice(oldDice => {
        return oldDice.map((die) => {
          if (die.isHeld === true) {
            return die;
          } else {
            const newDice = allNewDice(1);
            return newDice[0];
          }
        })
      })
    } else {
      setTenzies(false)
      setDice(allNewDice(10))
      setRolls(0)
    }
    
  }

  function holdDice(id) {
    setDice(prev => {
      return prev.map((newDie) => {
        if (newDie.id === id) {
          return {...newDie, isHeld: !newDie.isHeld}
        } else {
          return newDie
        }
      })
    })
  }

  function resetScore() {
    setBestScore(999999)
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="title--container">
        <h1 className="title">-- Tenzies --</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>
      <div className="dice--container">
        {dieElements}
      </div>
      <p>Rolls: {rolls}</p>
      {bestScore < 999999 && <p>Best Score: {bestScore}</p>}
      {tenzies && <p>You win!</p>}
      <button onClick={rollDice} className="roll-dice">
        {tenzies ? "New Game" : "Roll"}
        </button>
      {!tenzies && <button onClick={resetScore} className="roll-dice">
      Reset Score
      </button>}
    </main>
  )
}