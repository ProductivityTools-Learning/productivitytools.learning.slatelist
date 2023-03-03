import React, { useCallback, useState } from 'react'
import { Editor, createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

// Import the `Editor` and `Transforms` helpers from Slate.

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
    },
]

const PageExample = () => {
    const [editor] = useState(() => withReact(createEditor()))

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    return (
        <Slate editor={editor} value={initialValue}>
            <Editable
                renderElement={renderElement}
                onKeyDown={event => {
                    if (event.key === '`' && event.ctrlKey) {
                        debugger;
                        event.preventDefault()
                        // Determine whether any of the currently selected blocks are code blocks.
                        const [match] = Editor.nodes(editor, {
                            match: n => { debugger; return n.type === 'code' }
                        })
                        // Toggle the block type depending on whether there's already a match.
                        Transforms.setNodes(
                            editor,
                            { type: match ? 'paragraph' : 'code' },
                            { match: n => { debugger; return Editor.isBlock(editor, n) } }
                        )
                    }
                }}
            />
        </Slate>
    )
}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}
export default PageExample;
