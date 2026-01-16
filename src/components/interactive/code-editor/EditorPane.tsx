'use client'

import { useEffect, useRef, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers, keymap } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { EDITOR_CONFIG } from './constants'
import type { EditorPaneProps } from './types'

export function EditorPane({
  code,
  onChange,
  readOnly = false,
  className = '',
}: EditorPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  const createEditor = useCallback(() => {
    if (!containerRef.current) return

    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        python(),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        updateListener,
        EditorView.lineWrapping,
        EditorState.tabSize.of(EDITOR_CONFIG.tabSize),
        EditorState.readOnly.of(readOnly),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-scroller': {
            fontFamily: 'ui-monospace, monospace',
          },
          '.cm-content': {
            padding: '8px 0',
          },
        }),
      ],
    })

    viewRef.current = new EditorView({
      state,
      parent: containerRef.current,
    })
  }, [code, readOnly])

  useEffect(() => {
    createEditor()

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [createEditor])

  useEffect(() => {
    if (viewRef.current) {
      const currentCode = viewRef.current.state.doc.toString()
      if (currentCode !== code) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentCode.length,
            insert: code,
          },
        })
      }
    }
  }, [code])

  return (
    <div
      ref={containerRef}
      className={`h-full min-h-[200px] overflow-hidden rounded-md border border-gray-700 ${className}`}
      data-testid="editor-pane"
    />
  )
}
