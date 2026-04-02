import React, { useState, useMemo } from 'react';
import { questions } from '../data/questions/index';
import { translations } from '../data/translations';
import './QuestionManager.css';

const QuestionManager = ({ language, onQuit }) => {
    const t = translations[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTopic, setFilterTopic] = useState('curb'); // Default to curb
    const [deletedIds, setDeletedIds] = useState(new Set());
    const [editedQuestions, setEditedQuestions] = useState({});

    const topics = useMemo(() => {
        return Array.from(new Set(questions.map(q => q.topic || q.category))).sort();
    }, []);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const topic = q.topic || q.category;
            const topicMatch = filterTopic === 'all' || topic === filterTopic;
            const textHe = q.text?.he || q.question?.he || '';
            const textEn = q.text?.en || q.question?.en || '';
            const searchMatch = !searchTerm || 
                textHe.toLowerCase().includes(searchTerm.toLowerCase()) || 
                textEn.toLowerCase().includes(searchTerm.toLowerCase());
            return topicMatch && searchMatch;
        });
    }, [filterTopic, searchTerm]);

    const handleToggleDelete = (id) => {
        setDeletedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleEdit = (id, field, value, lang = null) => {
        setEditedQuestions(prev => {
            const q = { ...(prev[id] || questions.find(item => item.id === id)) };
            if (lang) {
                const textField = q.text ? 'text' : 'question';
                q[textField] = { ...q[textField], [lang]: value };
            } else {
                q[field] = value;
            }
            return { ...prev, [id]: q };
        });
    };

    const exportChanges = () => {
        const payload = {
            deletedIds: Array.from(deletedIds),
            updates: editedQuestions
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question_updates_${filterTopic}.json`;
        a.click();
        
        console.log("QUESTION_MANAGER_CHANGES_START");
        console.log(JSON.stringify(payload));
        console.log("QUESTION_MANAGER_CHANGES_END");
        
        alert("השינויים יוצאו! אנא העתק את הקובץ או הטקסט מהקונסול ושלח אלי.");
    };

    return (
        <div className="question-manager glass-panel">
            <div className="manager-header">
                <h2>ניהול שאלות ({filteredQuestions.length})</h2>
                <div className="header-actions">
                    <button onClick={onQuit} className="btn-secondary">חזרה</button>
                    <button onClick={exportChanges} className="btn-primary">ייצוא שינויים</button>
                </div>
            </div>

            <div className="manager-filters">
                <div className="filter-group">
                    <label>נושא:</label>
                    <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
                        <option value="all">הכל</option>
                        {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                    </select>
                </div>
                <div className="filter-group search-box">
                    <input 
                        type="text" 
                        placeholder="חיפוש שאלה..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>

            <div className="questions-list">
                {filteredQuestions.map(q => {
                    const isDeleted = deletedIds.has(q.id);
                    const draft = editedQuestions[q.id] || q;
                    const textHe = draft.text?.he || draft.question?.he || '';
                    const textEn = draft.text?.en || draft.question?.en || '';
                    
                    return (
                        <div key={q.id} className={`question-item ${isDeleted ? 'marked-removed' : ''}`}>
                            <div className="item-main">
                                <div className="item-texts">
                                    <textarea 
                                        className="text-he"
                                        value={textHe}
                                        onChange={e => handleEdit(q.id, 'text', e.target.value, 'he')}
                                    />
                                    <textarea 
                                        className="text-en"
                                        value={textEn}
                                        onChange={e => handleEdit(q.id, 'text', e.target.value, 'en')}
                                    />
                                </div>
                                <div className="item-meta">
                                    <span className="id-tag">{q.id}</span>
                                    <span className="level-tag">Level {q.level}</span>
                                    <button 
                                        className={`btn-toggle ${isDeleted ? 'btn-undo' : 'btn-remove'}`}
                                        onClick={() => handleToggleDelete(q.id)}
                                    >
                                        {isDeleted ? 'החזר' : 'הסר'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionManager;
