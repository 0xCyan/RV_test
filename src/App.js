import { useState } from "react";

function App() {

  const [textFile, setTextFile] = useState("");
  const [commonWords, setCommonWords] = useState();
  const [result, setResult] = useState("");
  const [threshold, setThreshold] = useState(10);

  const loadTextFile = async (event) => {
    event.preventDefault();
    const fileReader = new FileReader();
    fileReader.onload = async (event) => { 
      setTextFile(event.target.result);
    };
    fileReader.readAsText(event.target.files[0]);
  }

  const loadCommonWords = async (event) => {
    event.preventDefault();
    const fileReader = new FileReader();
    fileReader.onload = async (event) => { 
      setCommonWords(event.target.result);
    };
    fileReader.readAsText(event.target.files[0]);
  }

  const updateThreshold = (event) => {
    setThreshold(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (textFile.length > 0 && commonWords.length > 0) {
      const alpha = textFile.replace(/[^a-z0-9 ]/gi, '');
      const textFileArr = alpha.split(" ");
      const commonWordsArr = commonWords.split("\n");
  
      const filteredArr = textFileArr.filter(word => !commonWordsArr.includes(word));
  
      // convert array to set so we don't hvae duplicates and we can begin counting the number of times we see a given word
      let wordsToOccurrences = new Map();
      for (const word of filteredArr) {
        if (word.length > 0) {
          if (wordsToOccurrences.has(word)) {
            let prevCnt = wordsToOccurrences.get(word);
            wordsToOccurrences.set(word, prevCnt + 1);
          }
          else {
            wordsToOccurrences.set(word, 1);
          }
        }
      }
      const sortedWords = new Map([...wordsToOccurrences.entries()].sort((a, b) => b[1] - a[1]));
      let result = "";
      let keys = sortedWords.keys();
      for (let i = 0; i < threshold; i++) {
        let key = keys.next().value;
        result += sortedWords.get(key) + "\t" + key + "\n";
      }
      setResult(result);
    }
    else {
      alert("Files must be loaded to run app!");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Choose a text file:</label>
        <input
          type="file"
          id="textFile"
          name="textFile"
          accept=".txt"
          onChange={loadTextFile}
        /> 
        <label>Choose common words file:</label>
        <input
          type="file"
          id="commonWords"
          name="commonWords"
          accept=".txt"
          onChange={loadCommonWords}
        />
        <label>Display top: </label>
        <input 
          type="number"
          id="filterTop"
          name="filterTop"
          onChange={updateThreshold}
        />
        <button type="submit">Run</button>
      </form>
      <div style={{whiteSpace:"pre-wrap"}}>
        <h3>Result:</h3>
        <br></br>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;
