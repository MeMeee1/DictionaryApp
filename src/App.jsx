// App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import { dictionaryStore } from './dictionaryStore';

const App = () => {
  const [state, setState] = useState(dictionaryStore.getState());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const commonDefinitions = [
    { name: 'Abundant', definition: 'Present in large quantities' },
    { name: 'Benevolent', definition: 'Well-meaning and kindly' },
    { name: 'Candid', definition: 'Truthful and straightforward' },
    { name: 'Diligent', definition: 'Having or showing care and conscientiousness in one\'s work or duties' },
    { name: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing' },
  ];

  useEffect(() => {
    const unsubscribe = dictionaryStore.subscribe(() => {
      setState(dictionaryStore.getState());
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    dictionaryStore.dispatch({ type: 'SET_WORD', payload: e.target.value });
  };

  const fetchWordMeaning = async () => {
    const word = state.word.trim();
    if (!word) return;

    dictionaryStore.dispatch({ type: 'SET_LOADING', payload: true });
    dictionaryStore.dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error('Word not found');
      const result = await response.json();
      dictionaryStore.dispatch({ type: 'SET_RESULTS', payload: result });
    } catch {
      dictionaryStore.dispatch({ type: 'SET_ERROR', payload: 'Word not found' });
    } finally {
      dictionaryStore.dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWordMeaning();
  };

  const handlePlayAudio = (url) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Error playing audio:', err));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const goToNext = () => setCurrentIndex(i => (i + 1) % commonDefinitions.length);
  const goToPrevious = () => setCurrentIndex(i => (i - 1 + commonDefinitions.length) % commonDefinitions.length);
  const goToIndex = (index) => setCurrentIndex(index);

  return (
    <div className="container">
      <h1>📚 Dictionary App</h1>

      <div className="input-section">
        <input
          type="text"
          value={state.word}
          onChange={handleInputChange}
          placeholder="Enter a word..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={fetchWordMeaning} disabled={state.isLoading}>
          {state.isLoading ? 'Searching...' : 'Get Definition'}
        </button>
      </div>

      <button onClick={toggleDarkMode} className="toggle-mode">
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      {state.isLoading && <p className="loading-indicator">Loading...</p>}

      {state.error ? (
        <div className="error-card">
          <h2>🚫 Word not found</h2>
          <p>We couldn't find a definition for "{state.word}". Please try another word.</p>
        </div>
      ) : state.results.length > 0 ? (
        <div className="results">
          <h2>{state.results[0].word}</h2>

          {state.results[0].phonetics
            .filter(p => p.audio)
            .map((p, i) => (
              <div key={i}>
                <button onClick={() => handlePlayAudio(p.audio)}>
                  🔊 {i === 0 ? 'Male' : 'Female'}
                </button>
              </div>
            ))}

          {state.results[0].meanings.map((meaning, i) => (
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
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
