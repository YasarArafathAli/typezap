import {useState, useEffect} from 'react';
import './App.css';
import LetterBox from './components/LetterBox';
var milli = 0;
var sec = 0;
var Interval;
// import UserInput from './components/UserInput';

function App() {
  const [pattern,setPattern] = useState([])
  const [activeIndex, setActiveIndex] = useState(0);
  const [value, setValue] = useState('');
  const [timer,setTimer] = useState({sec:0,milli:0});
  const [highScore, setHighScore] = useState(0);
  const [result, setResult] = useState('')


  useEffect(() => {
    handleReset();
    setResult("")
    getHighScore();
    //eslint-disable-next-line
  }, []);

  //generate alphabet pattern
  function makeRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      if(i!== length-1) {
        result += ' ';
      }
      }
   return result.toUpperCase();
  }

  //timer setup
  function startTimer() {
    if(activeIndex<20){
      if(Interval) stopTimer();
      Interval = setInterval(startTime,10);
    }
  }

  function stopTimer() {
    clearInterval(Interval);
  }
// timer logic
  function startTime() {
    milli++;
    if(milli < 99){
    setTimer(previousState => {
      return {sec:previousState.sec, milli:previousState.milli++}
    });
    }
    if(milli > 99){
      sec++;
      milli = 0;
      setTimer(previousState => {
        return {sec:previousState.sec++, milli:0}
      })
    }
  }



 
  function getHighScore(){
    var hs = localStorage.getItem('highScore');
    if (hs) setHighScore(hs);
    else setHighScore(0)

  }
  const handleReset = () =>  {
    setPattern(makeRandom(20).split(' '));
    setTimer({sec:0,milli:0});
    stopTimer()
  }




  

  const processInput = () => {
    var input = value; 
    console.log(input);
    var currentActiveIndex = activeIndex;
    var currentInput = input.charAt(input.length-1)
    var currentLetter = currentActiveIndex===0?pattern[currentActiveIndex]:pattern[currentActiveIndex-1]
    console.log({"inp":currentInput, 'let':currentLetter, 'ind':currentActiveIndex})
    if(currentInput === currentLetter){
      console.log(currentActiveIndex, activeIndex)
      setActiveIndex(index => index +1);
      if(activeIndex >19){
        stopTimer()
        var time = (timer.sec) + '.' + (timer.milli<9? '0'+timer.milli:timer.milli);
        if(highScore < time){
          setResult("Success!");
          setHighScore(time.toString());
          localStorage.setItem('highScore', highScore)
        }
        else{
          setResult("Failure!")
        }
      }
    }
    else{
      setTimer(previousState => {
        return {sec:previousState.sec, milli:previousState.milli+50}
      });
    }
    

  }

  // handle backspace
  function handleKeyUp(e) {
    if(e.key === 'Backspace'){
      setActiveIndex(index => index-2)
  }}

  return (
    <div className="App">
    <h1>Type the Alphabet!</h1>
    <p className='info'>Typing game to see how fast you can type. Timer starts when you do.</p>
    {activeIndex===-1 ? <LetterBox pattern='Lets Start!' /> :
    <LetterBox pattern={activeIndex>20? result :pattern[activeIndex]} /> }
    <div >Time: {timer.sec}.{timer.milli<9? '0'+timer.milli:timer.milli}s</div>
    <div><h4>High score: {highScore}</h4></div>
    <div>
    <div>
    {/* <p>{value}</p> */}
    <input type="text" value={value} onFocus={() => {
      setActiveIndex(0);
      startTimer();}} onBlur={stopTimer} onKeyUp={handleKeyUp} onKeyDown= {processInput} onChange={e => setValue(e.target.value.toUpperCase())}/>
    <button onClick={handleReset}>Reset</button>
    </div>
    </div>
    </div>
  );
}

export default App;
