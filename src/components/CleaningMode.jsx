import React, { useState, useMemo } from 'react';
import { questions } from '../data/questions/index';
import { translations } from '../data/translations';
import './CleaningMode.css';

const CleaningMode = ({ language, onQuit }) => {
    const t = translations[language];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [deletedIds, setDeletedIds] = useState(new Set());
    const [updatedQuestions, setUpdatedQuestions] = useState({}); // id -> question object
    const [filterTopic, setFilterTopic] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const topicMatch = filterTopic === 'all' || q.topic === filterTopic;
            const levelMatch = filterLevel === 'all' || q.level === parseInt(filterLevel);
            return topicMatch && levelMatch;
        });
    }, [filterTopic, filterLevel]);

    const currentQuestion = filteredQuestions[currentIndex];
    const isDeleted = currentQuestion && deletedIds.has(currentQuestion.id);
    const draft = currentQuestion && (updatedQuestions[currentQuestion.id] || currentQuestion);

    // Helpers to handle both 'text' and 'question' properties
    const getQText = (lang) => {
        if (!draft) return '';
        const data = draft.text || draft.question;
        return data ? data[lang] : '';
    };

    const handleQTextChange = (lang, value) => {
        const field = draft.text ? 'text' : 'question';
        handleFieldChange(field, value, lang);
    };

    const handleNext = () => {
        if (currentIndex < filteredQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const toggleDelete = () => {
        const newDeleted = new Set(deletedIds);
        if (newDeleted.has(currentQuestion.id)) {
            newDeleted.delete(currentQuestion.id);
        } else {
            newDeleted.add(currentQuestion.id);
            // Move to next question automatically if not at the end
            if (currentIndex < filteredQuestions.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 300); // Small delay so the user sees the "deleted" state briefly
            }
        }
        setDeletedIds(newDeleted);
    };

    const handleFieldChange = (field, value, subField = null) => {
        setUpdatedQuestions(prev => {
            const q = { ...(prev[currentQuestion.id] || currentQuestion) };
            if (subField) {
                // Ensure the field exists as an object before setting subField
                q[field] = typeof q[field] === 'object' && q[field] !== null ? { ...q[field] } : {};
                q[field][subField] = value;
            } else {
                q[field] = value;
            }
            return { ...prev, [currentQuestion.id]: q };
        });
    };

    const handleOptionChange = (lang, index, value) => {
        setUpdatedQuestions(prev => {
            const q = { ...(prev[currentQuestion.id] || currentQuestion) };
            const newOptions = { ...q.options };
            const langOptions = [...(newOptions[lang] || [])];
            langOptions[index] = value;
            newOptions[lang] = langOptions;
            q.options = newOptions;
            return { ...prev, [currentQuestion.id]: q };
        });
    };

    const exportChanges = () => {
        const payload = {
            deletedIds: Array.from(deletedIds),
            updates: updatedQuestions
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaning_changes.json';
        a.click();

        // Also log to console for easy copy-paste for the assistant
        console.log("CLEANING_CHANGES_START");
        console.log(JSON.stringify(payload));
        console.log("CLEANING_CHANGES_END");
        alert("Changes exported to console and downloaded as JSON. Please share this with the assistant.");
    };

    if (!currentQuestion) {
        return (
            <div className="cleaning-mode glass-panel">
                <h2>Cleaning Mode</h2>
                <p>No questions found with current filters.</p>
                <button onClick={onQuit}>Exit</button>
            </div>
        );
    }

    const topics = Array.from(new Set(questions.map(q => q.topic || q.category))).sort();

    return (
        <div className="cleaning-mode glass-panel">
            <div className="cleaning-header">
                <h2>Cleaning Mode ({currentIndex + 1} / {filteredQuestions.length})</h2>
                <div className="cleaning-controls">
                    <button onClick={onQuit} className="exit-btn">Exit</button>
                    <button onClick={exportChanges} className="export-btn">Export Changes</button>
                </div>
            </div>

            <div className="filters">
                <select value={filterTopic} onChange={e => { setFilterTopic(e.target.value); setCurrentIndex(0); }}>
                    <option value="all">All Topics</option>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setCurrentIndex(0); }}>
                    <option value="all">All Levels</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                </select>
            </div>

            <div className={`question-editor ${isDeleted ? 'marked-deleted' : ''}`}>
                <div className="editor-row">
                    <div className="editor-group">
                        <label>Question (HE)</label>
                        <textarea
                            value={getQText('he')}
                            onChange={e => handleQTextChange('he', e.target.value)}
                        />
                    </div>
                    <div className="editor-group">
                        <label>Question (EN)</label>
                        <textarea
                            value={getQText('en')}
                            onChange={e => handleQTextChange('en', e.target.value)}
                        />
                    </div>
                </div>

                <div className="editor-row">
                    <div className="editor-group">
                        <label>Options (HE)</label>
                        {(draft.options?.he || []).map((opt, i) => (
                            <input
                                key={i}
                                value={opt}
                                onChange={e => handleOptionChange('he', i, e.target.value)}
                                className={i === 0 ? 'correct-answer' : ''}
                            />
                        ))}
                    </div>
                    <div className="editor-group">
                        <label>Options (EN)</label>
                        {(draft.options?.en || []).map((opt, i) => (
                            <input
                                key={i}
                                value={opt}
                                onChange={e => handleOptionChange('en', i, e.target.value)}
                                className={i === 0 ? 'correct-answer' : ''}
                            />
                        ))}
                    </div>
                </div>

                <div className="editor-row">
                    <div className="editor-group">
                        <label>Hint (HE)</label>
                        <input value={draft.hint?.he || ''} onChange={e => handleFieldChange('hint', e.target.value, 'he')} />
                    </div>
                    <div className="editor-group">
                        <label>Hint (EN)</label>
                        <input value={draft.hint?.en || ''} onChange={e => handleFieldChange('hint', e.target.value, 'en')} />
                    </div>
                </div>

                <div className="meta-row">
                    <span>ID: {currentQuestion.id}</span>
                    <div className="level-editor">
                        <label>Level:</label>
                        <select
                            value={draft.level}
                            onChange={e => handleFieldChange('level', parseInt(e.target.value))}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <span>Topic: {currentQuestion.topic || currentQuestion.category}</span>
                </div>

                <div className="action-buttons">
                    <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
                    <button onClick={toggleDelete} className={isDeleted ? 'btn-undo' : 'btn-delete'}>
                        {isDeleted ? 'Undo Delete' : 'Delete Question'}
                    </button>
                    <button onClick={handleNext} disabled={currentIndex === filteredQuestions.length - 1}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default CleaningMode;
