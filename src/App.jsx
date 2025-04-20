import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const commonDefinitions = [
    { name: 'Abundant', definition: 'Present in large quantities' },
    { name: 'Benevolent', definition: 'Well-meaning and kindly' },
    { name: 'Candid', definition: 'Truthful and straightforward' },
    { name: 'Diligent', definition: 'Having or showing care and conscientiousness in one\'s work or duties' },
    { name: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing' },
  ];

  const getWordMeaning = async () => {
    if (!word.trim()) return;
    
    setError(false);
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  const handlePlayAudio = (audioUrl) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error('Error playing audio:', e));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === commonDefinitions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? commonDefinitions.length - 1 : prevIndex - 1
    );
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="container">
      <h1>📚 Dictionary App</h1>
      
      <div className="input-section">
        <input 
          type="text" 
          value={word} 
          onChange={handleChange} 
          placeholder="Enter a word..."
          onKeyDown={(e) => e.key === 'Enter' && getWordMeaning()}
        />
        <button onClick={getWordMeaning} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Get Definition'}
        </button>
      </div>

      <button onClick={toggleDarkMode} className="toggle-mode">
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      {isLoading && (
        <div className="loading-indicator">
          <p>Loading...</p>
        </div>
      )}

      {error ? (
        <div className="error-card">
          <h2>🚫 Word not found</h2>
          <p>We couldn't find a definition for "{word}". Please try another word.</p>
        </div>
      ) : data.length > 0 ? (
        <div className="results">
          <h2>{data[0].word}</h2>
          {data[0].phonetics.filter(p => p.audio).map((p, index) => (
            <div key={index}>
              <button onClick={() => handlePlayAudio(p.audio)}>
                🔊 { index == 0? "Male":"Female"}
              </button>
            </div>
          ))}
          {data[0].meanings.map((meaning, i) => (
            <div className="meaning" key={i}>
              <h3>{meaning.partOfSpeech}</h3>
              <ul>
                {meaning.definitions.slice(0, 5).map((def, j) => (
                  <li key={j}>
                    <strong>Definition:</strong> {def.definition}
                    {def.example && (
                      <div className="example">
                        <em>Example:</em> "{def.example}"
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="card-carousel">
            <div className="card">
              <h3>{commonDefinitions[currentIndex].name}</h3>
              <p>{commonDefinitions[currentIndex].definition}</p>
            </div>
          </div>
          <div className="carousel-controls">
            <button onClick={goToPrevious}>❮ Prev</button>
            <button onClick={goToNext}>Next ❯</button>
          </div>
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