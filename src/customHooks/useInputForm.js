import { useState } from 'react';

export const useInputForm = (initialValue) => {
  const [input, setInput] = useState(initialValue || '');
  const onInputChanged = e => setInput(e.target.value);
  return [ input, onInputChanged ];
}