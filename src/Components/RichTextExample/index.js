import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
} from 'slate'
import { Toolbar, Button, Icon } from './components'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const RichTextExample = () => {
    const renderElement = useCallback(props => <Element {...props} />, [])

    const editor = useMemo(() => withReact(createEditor()), [])


    return (<Slate editor={editor} value={initialValue}>
        <Toolbar>
            <BlockButton format="heading-one" icon="looks_one" />
        </Toolbar>
        <Editable
            renderElement={renderElement}
        ></Editable>
    </Slate>)
}

const Element = ({ attribites, children, element }) => {
    debugger;
    switch (element.type) {
        case 'heading-one':
            return (<h1 {...attribites}>
                {children}
            </h1>)
        default:
            return <span {...attribites}>{children}</span>
    }
}

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            onMouseDown={event => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

const toggleBlock = (editor, format) => {
    debugger;
    const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true
    })
    let newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }

    Transforms.setNodes(editor, newProperties);
}

const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor
    if (!selection) return false;
    let editorNodes = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n[blockType] == format,
    })
    debugger;
    console.log(editorNodes);

    const [match] = Array.from(editorNodes)

    return !!match;
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
    },
    {
        type: 'paragraph',
        align: 'center',
        children: [{ text: 'Try it out for yourself!' }],
    },
]


export default RichTextExample;