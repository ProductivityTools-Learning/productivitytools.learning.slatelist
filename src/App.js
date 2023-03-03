import './App.css';

import React, { useState } from 'react'
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

function App() {


  const [editor] = useState(() => withReact(createEditor()))

  return (
    <div className="App">
      <Slate editor={editor} value={initialValue} >
        <Editable />
      </Slate>
    </div>
  );
}

export default App;
