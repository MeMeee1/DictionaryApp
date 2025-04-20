import { useState } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(false); // New state to track error

  const commonDefinitions = [
    { name: 'Abundant', definition: 'Present in large quantities' },
    { name: 'Benevolent', definition: 'Well-meaning and kindly' },
    { name: 'Candid', definition: 'Truthful and straightforward' },
    { name: 'Diligent', definition: 'Having or showing care and conscientiousness in one\'s work or duties' },
    { name: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing' },
  ];

  const getWordMeaning = async () => {
    setError(false); // Reset error state before each new search
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true); // Set error state if an error occurs
    }
  };

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  const handlePlayAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // States for carousel navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < commonDefinitions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(commonDefinitions.length - 1); // Loop to last
    }
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="container">
      <h1>📚 Dictionary App</h1>
      <div className="input-section">
        <input type="text" value={word} onChange={handleChange} placeholder="Enter a word..." />
        <button onClick={getWordMeaning}>Get Definition</button>
      </div>

      {error ? (
        // Show error card when error state is true
        <div className="error-card">
          <h2>🚫 Error: Word not found</h2>
          <p>We couldn't find a definition for "{word}". Please try another word.</p>
        </div>
      ) : data.length > 0 ? (
        <div className="results">
          <h2>{data[0].word}</h2>

          {data[0].phonetics.map((p, index) => (
            p.audio && (
              <div key={index}>
                <button onClick={() => handlePlayAudio(p.audio)}>🔊 Listen </button>
              </div>
            )
          ))}

          {data[0].meanings.map((meaning, i) => (
            <div className="meaning" key={i}>
              <h3>{meaning.partOfSpeech}</h3>
              <ul>
                {meaning.definitions.map((def, j) => (
                  <li key={j}>
                    <strong>Definition:</strong> {def.definition}
                    {def.example && <div><em>Example:</em> "{def.example}"</div>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-carousel">
          <div className="card">
            <h3>{commonDefinitions[currentIndex].name}</h3>
            <p>{commonDefinitions[currentIndex].definition}</p>
          </div>
        </div>
      )}

      {/* Show carousel controls and dot indicators only if data.length is 0 */}
      {data.length === 0 && !error && (
        <>
          {/* Carousel Controls */}
          <div className="carousel-controls">
            <button onClick={goToPrevious}>❮ Prev</button>
            <button onClick={goToNext}>Next ❯</button>
          </div>

          {/* Dot Indicators */}
          <div className="dot-indicators">
            {commonDefinitions.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
