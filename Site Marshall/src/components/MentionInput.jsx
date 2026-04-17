import React, { useRef, useState, useEffect, useCallback } from 'react';
import { machineDB } from '../data/mockData';

const shortName = (model) => model.split('/').pop().trim();

const MentionInput = ({
    value,
    onChange,
    onSubmit,
    placeholder = 'Type a question…',
    disabled = false,
    className = '',
}) => {
    const editorRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filter, setFilter] = useState('');

    const filteredMachines = machineDB.filter(m =>
        !filter ||
        shortName(m.model).toLowerCase().includes(filter.toLowerCase()) ||
        m.type.toLowerCase().includes(filter.toLowerCase())
    ).slice(0, 6);

    // Sync clear from parent (e.g. after submit)
    useEffect(() => {
        if (value === '' && editorRef.current) {
            editorRef.current.innerHTML = '';
        }
    }, [value]);

    const getBeforeCursor = () => {
        const el = editorRef.current;
        if (!el) return '';
        const sel = window.getSelection();
        if (!sel?.rangeCount) return '';
        const range = sel.getRangeAt(0);
        const pre = document.createRange();
        pre.selectNodeContents(el);
        pre.setEnd(range.startContainer, range.startOffset);
        return pre.toString();
    };

    const handleInput = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        onChange(el.innerText);

        const before = getBeforeCursor();
        const match = before.match(/@([^@\s]*)$/);
        if (match) {
            setShowDropdown(true);
            setFilter(match[1]);
        } else {
            setShowDropdown(false);
            setFilter('');
        }
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!showDropdown) onSubmit?.();
        }
        if (e.key === 'Escape') setShowDropdown(false);
    }, [showDropdown, onSubmit]);

    const insertMention = useCallback((machine) => {
        const el = editorRef.current;
        if (!el) return;

        const sel = window.getSelection();
        if (!sel?.rangeCount) return;

        const range = sel.getRangeAt(0);
        const before = getBeforeCursor();
        const match = before.match(/@([^@\s]*)$/);
        if (!match) return;

        // Delete the @filter text typed so far
        const del = document.createRange();
        del.setStart(range.startContainer, range.startOffset - match[0].length);
        del.setEnd(range.startContainer, range.startOffset);
        del.deleteContents();

        // Build the colored mention span (non-editable so it acts as one unit)
        const span = document.createElement('span');
        span.style.color = '#E67E22';
        span.style.fontWeight = '700';
        span.dataset.machineId = machine.id;
        span.textContent = `@${shortName(machine.model)}`;

        // Insert span + trailing space
        del.insertNode(span);
        const space = document.createTextNode('\u00A0'); // nbsp keeps cursor after span
        span.after(space);

        // Move cursor after the space
        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        onChange(el.innerText);
        setShowDropdown(false);
        el.focus();
    }, [onChange]);

    const isEmpty = !value || value.trim() === '';

    return (
        <div className={`relative flex-1 ${className}`}>
            {/* Placeholder */}
            {isEmpty && (
                <div className="absolute inset-0 flex items-center pointer-events-none px-0 text-gray-400 text-base select-none">
                    {placeholder}
                </div>
            )}

            {/* Contenteditable editor */}
            <div
                ref={editorRef}
                contentEditable={!disabled}
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none text-gray-700 text-base leading-normal min-h-[1.5em] break-words"
                style={{ caretColor: '#374151' }}
            />

            {/* Mention dropdown */}
            {showDropdown && filteredMachines.length > 0 && (
                <div className="absolute bottom-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-gray/15 overflow-hidden mb-2 z-50">
                    <div className="px-3 pt-2 pb-1">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-gray">
                            Machines
                        </span>
                    </div>
                    {filteredMachines.map((machine) => (
                        <button
                            key={machine.id}
                            // mousedown fires before blur, preventDefault keeps editor focused
                            onMouseDown={(e) => { e.preventDefault(); insertMention(machine); }}
                            onTouchEnd={(e) => { e.preventDefault(); insertMention(machine); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-orange-50 active:bg-orange-100 flex items-center gap-3 transition-colors"
                        >
                            <span className="text-safety-orange font-black text-sm">@</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-charcoal truncate">
                                    {shortName(machine.model)}
                                </div>
                                <div className="text-[10px] text-slate-gray uppercase tracking-widest truncate">
                                    {machine.type}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentionInput;
