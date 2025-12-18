// pages/discussion.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Discussion board v1.0 loaded');
    
    // Initialize discussion board
    initializeDiscussionBoard();
    
    // Initialize notification system
    initializeNotifications();
    
    // Load saved threads from localStorage
    loadSavedThreads();
});

function initializeDiscussionBoard() {
    // Thread counter (stored in localStorage for persistence)
    let threadCounter = localStorage.getItem('discussion_thread_counter') || 420;
    let postCounter = {
        1: localStorage.getItem('thread_1_posts') || 85,
        2: localStorage.getItem('thread_2_posts') || 128,
        3: localStorage.getItem('thread_3_posts') || 43
    };
    
    // 1. POST NEW THREAD
    const postThreadBtn = document.getElementById('postThread');
    if (postThreadBtn) {
        postThreadBtn.addEventListener('click', function() {
            const titleInput = document.getElementById('threadTitle');
            const contentInput = document.getElementById('threadContent');
            
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            
            if (title && content) {
                // Increment thread counter
                threadCounter++;
                localStorage.setItem('discussion_thread_counter', threadCounter);
                
                // Get encryption setting
                const encrypt = document.querySelector('input[name="encrypt"]').checked;
                const priority = document.querySelector('input[name="priority"]').checked;
                
                // Create thread data
                const threadData = {
                    id: threadCounter,
                    title: title,
                    content: encrypt ? nabazovCipher(content) : content,
                    author: getRandomName(),
                    timestamp: getCurrentDate(),
                    encrypted: encrypt,
                    priority: priority,
                    posts: 1
                };
                
                // Save to localStorage
                saveThreadToStorage(threadData);
                
                // Create and display thread
                createThreadElement(threadData);
                
                // Clear form
                titleInput.value = '';
                contentInput.value = '';
                
                // Show notification
                showNotification(`Thread #${threadCounter} created successfully`, 'success');
                
                // Update stats
                updateBoardStats();
                
            } else {
                showNotification('Please fill in both title and content.', 'error');
            }
        });
    }
    
    // 2. REPLY SYSTEM
    const replyBtn = document.querySelector('.reply-btn');
    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            const replyBox = this.closest('.reply-box');
            const textarea = replyBox.querySelector('textarea');
            const nameInput = replyBox.querySelector('.name-input');
            const subjectSelect = replyBox.querySelector('.subject-select');
            
            const content = textarea.value.trim();
            const author = nameInput.value.trim() || 'Anonymous';
            const subject = subjectSelect.value;
            
            if (content) {
                // Get thread ID from context (assuming thread #1 for demo)
                const threadId = 1;
                
                // Create reply data
                const replyData = {
                    threadId: threadId,
                    content: content,
                    author: author,
                    subject: subject,
                    timestamp: getCurrentDate(),
                    postNumber: postCounter[threadId] + 1
                };
                
                // Save reply
                saveReplyToStorage(replyData);
                
                // Update counters
                postCounter[threadId]++;
                localStorage.setItem(`thread_${threadId}_posts`, postCounter[threadId]);
                
                // Update thread display
                updateThreadPostCount(threadId, postCounter[threadId]);
                
                // Clear form
                textarea.value = '';
                nameInput.value = '';
                
                showNotification(`Reply posted to thread #${threadId}`, 'success');
                
            } else {
                showNotification('Please enter reply content.', 'error');
            }
        });
    }
    
    // 3. ENCRYPT & POST BUTTON
    const encryptBtn = document.querySelector('.encrypt-btn');
    if (encryptBtn) {
        encryptBtn.addEventListener('click', function() {
            const replyBox = this.closest('.reply-box');
            const textarea = replyBox.querySelector('textarea');
            const original = textarea.value.trim();
            
            if (original) {
                const encrypted = nabazovCipher(original);
                textarea.value = encrypted;
                
                // Auto-post after 1 second
                setTimeout(() => {
                    if (replyBtn) replyBtn.click();
                    showNotification('Message encrypted with Nabazov cipher', 'info');
                }, 1000);
            }
        });
    }
    
    // 4. VIEW THREAD FUNCTIONALITY
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-thread')) {
            const threadElement = e.target.closest('.thread');
            const threadId = threadElement.dataset.id;
            
            // Load thread data
            const threadData = loadThreadFromStorage(threadId);
            
            // Open thread viewer
            openThreadViewer(threadData, threadElement);
        }
    });
    
    // 5. ATTACH DOCUMENT BUTTON
    const attachBtn = document.querySelector('.attach-btn');
    if (attachBtn) {
        attachBtn.addEventListener('click', function() {
            const files = [
                'ritual_sketch.jpg',
                'translation_notes.txt',
                'buratsov_letter.pdf',
                'flame_analysis.csv',
                'thermal_scan.png',
                'manuscript_fragment.jpg'
            ];
            const randomFile = files[Math.floor(Math.random() * files.length)];
            
            const replyBox = this.closest('.reply-box');
            const attachmentDiv = document.createElement('div');
            attachmentDiv.className = 'attachment';
            attachmentDiv.innerHTML = `
                <span style="color: #6699ff">📎 ${randomFile} (2.4 MB)</span>
                <button class="remove-attach" style="margin-left: 10px; padding: 2px 5px; font-size: 10px;">remove</button>
            `;
            
            const buttons = replyBox.querySelector('.reply-buttons');
            replyBox.insertBefore(attachmentDiv, buttons);
            
            attachmentDiv.querySelector('.remove-attach').addEventListener('click', function() {
                attachmentDiv.remove();
            });
            
            showNotification(`Attachment "${randomFile}" added`, 'info');
        });
    }
}

function openThreadViewer(threadData, threadElement) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'thread-viewer-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
        font-family: 'Courier New', monospace;
    `;
    
    // Build modal content
    modal.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 3px double #cc9900; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #cc9900; padding-bottom: 10px;">
                <h2 style="color: #ff9900; margin: 0;">${escapeHtml(threadData.title)}</h2>
                <button id="closeThreadViewer" style="background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace;">CLOSE</button>
            </div>
            
            <div style="margin-bottom: 30px; color: #999; font-size: 12px;">
                <span>Thread #${threadData.id}</span> | 
                <span>Started by: ${escapeHtml(threadData.author)}</span> | 
                <span>${threadData.timestamp}</span> |
                <span>Posts: ${threadData.posts}</span>
                ${threadData.encrypted ? ' | <span style="color: #00cc00;">ENCRYPTED</span>' : ''}
                ${threadData.priority ? ' | <span style="color: #ff0000;">PRIORITY</span>' : ''}
            </div>
            
            <!-- Original Post -->
            <div style="background: #111; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; color: #6699ff; font-size: 12px; margin-bottom: 10px; border-bottom: 1px dotted #333; padding-bottom: 5px;">
                    <span>${escapeHtml(threadData.author)}</span>
                    <span>${threadData.timestamp}</span>
                    <span>#1</span>
                </div>
                <div style="color: #cccccc; line-height: 1.5;">
                    ${threadData.encrypted ? 
                        `<div style="background: #001100; padding: 10px; border: 1px solid #00cc00; margin: 10px 0;">
                            <div style="color: #00cc00; font-size: 11px; margin-bottom: 5px;">ENCRYPTED CONTENT (Nabazov Cipher):</div>
                            <div style="font-family: monospace;">${escapeHtml(threadData.content)}</div>
                        </div>` 
                        : 
                        `<p>${escapeHtml(threadData.content)}</p>`
                    }
                </div>
            </div>
            
            <!-- Replies Section -->
            <div id="threadReplies" style="margin-bottom: 30px;">
                <h3 style="color: #cc9900; border-bottom: 1px solid #444; padding-bottom: 5px;">Replies (${threadData.posts - 1})</h3>
                <!-- Replies will be loaded here -->
            </div>
            
            <!-- Add Reply Form -->
            <div style="background: #111; border: 1px solid #333; padding: 20px;">
                <h3 style="color: #ffcc00; margin-top: 0;">Add Reply</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="replyAuthor" placeholder="Name (optional)" style="flex: 1; background: #000; color: #cc9900; border: 1px solid #666; padding: 8px;">
                    <input type="text" id="replySubject" placeholder="Subject" style="flex: 2; background: #000; color: #cc9900; border: 1px solid #666; padding: 8px;" value="Re: ${escapeHtml(threadData.title)}">
                </div>
                <textarea id="replyContent" placeholder="Type your reply here..." rows="6" style="width: 100%; background: #000; color: #cc9900; border: 1px solid #666; padding: 10px; margin-bottom: 10px; font-family: 'Courier New', monospace;"></textarea>
                <div style="display: flex; gap: 10px;">
                    <button id="submitThreadReply" style="background: #003300; color: #00cc00; border: 2px outset #006600; padding: 10px 20px; cursor: pointer; font-family: monospace;">POST REPLY</button>
                    <button id="encryptThreadReply" style="background: #000033; color: #6699ff; border: 2px outset #003366; padding: 10px 20px; cursor: pointer; font-family: monospace;">ENCRYPT & POST</button>
                    <button id="cancelThreadReply" style="background: #330000; color: #ff6666; border: 2px outset #660000; padding: 10px 20px; cursor: pointer; font-family: monospace;">CANCEL</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load replies
    loadRepliesForThread(threadData.id, modal.querySelector('#threadReplies'));
    
    // Add event listeners
    const closeBtn = modal.querySelector('#closeThreadViewer');
    const cancelBtn = modal.querySelector('#cancelThreadReply');
    const submitBtn = modal.querySelector('#submitThreadReply');
    const encryptBtn = modal.querySelector('#encryptThreadReply');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    
    submitBtn.addEventListener('click', function() {
        const author = modal.querySelector('#replyAuthor').value.trim();
        const content = modal.querySelector('#replyContent').value.trim();
        
        if (content) {
            // Create reply
            const replyData = {
                threadId: threadData.id,
                content: content,
                author: author || 'Anonymous',
                timestamp: getCurrentDate(),
                postNumber: threadData.posts + 1
            };
            
            // Save reply
            saveReplyToStorage(replyData);
            
            // Update thread post count
            threadData.posts++;
            updateThreadInStorage(threadData);
            
            // Add reply to display
            addReplyToViewer(replyData, modal.querySelector('#threadReplies'));
            
            // Clear form
            modal.querySelector('#replyAuthor').value = '';
            modal.querySelector('#replyContent').value = '';
            
            // Update original thread element
            updateThreadPostCount(threadData.id, threadData.posts);
            
            showNotification('Reply added to thread', 'success');
            
        } else {
            showNotification('Please enter reply content.', 'error');
        }
    });
    
    encryptBtn.addEventListener('click', function() {
        const contentInput = modal.querySelector('#replyContent');
        const original = contentInput.value.trim();
        
        if (original) {
            const encrypted = nabazovCipher(original);
            contentInput.value = encrypted;
            
            setTimeout(() => {
                submitBtn.click();
                showNotification('Reply encrypted with Nabazov cipher', 'info');
            }, 800);
        }
    });
    
    // Close on ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

function loadRepliesForThread(threadId, container) {
    const replies = getRepliesFromStorage(threadId);
    
    if (replies.length === 0) {
        // Add sample replies for demonstration
        const sampleReplies = [
            {
                author: 'Archivist_Prime',
                timestamp: '12/16/2023 10:22',
                content: 'Has anyone cross-referenced this with the 1798 St. Petersburg fire records? The patterns match Nabazov\'s early purification rituals.',
                postNumber: 2
            },
            {
                author: 'Researcher_42',
                timestamp: '12/16/2023 11:45',
                content: 'I\'ve uploaded thermal analysis of the Leicester site. The heat patterns suggest focused energy release, not random combustion.',
                postNumber: 3
            },
            {
                author: 'Dr. Vance',
                timestamp: '12/16/2023 14:30',
                content: 'The scar discrepancy could be explained by post-ascension regeneration. Remember: Buratsov achieved immortality in 1817.',
                postNumber: 4
            }
        ];
        
        sampleReplies.forEach(reply => {
            addReplyToViewer(reply, container);
        });
    } else {
        replies.forEach(reply => {
            addReplyToViewer(reply, container);
        });
    }
}

function addReplyToViewer(replyData, container) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'thread-reply';
    replyDiv.style.cssText = `
        background: #151515;
        border: 1px solid #333;
        padding: 15px;
        margin-bottom: 15px;
    `;
    
    replyDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; color: #6699ff; font-size: 12px; margin-bottom: 10px; border-bottom: 1px dotted #333; padding-bottom: 5px;">
            <span>${escapeHtml(replyData.author)}</span>
            <span>${replyData.timestamp}</span>
            <span>#${replyData.postNumber}</span>
        </div>
        <div style="color: #cccccc; line-height: 1.5;">
            <p>${escapeHtml(replyData.content)}</p>
        </div>
    `;
    
    container.appendChild(replyDiv);
}

// Storage Functions
function saveThreadToStorage(threadData) {
    const threads = JSON.parse(localStorage.getItem('discussion_threads') || '[]');
    threads.push(threadData);
    localStorage.setItem('discussion_threads', JSON.stringify(threads));
}

function loadThreadFromStorage(threadId) {
    const threads = JSON.parse(localStorage.getItem('discussion_threads') || '[]');
    return threads.find(t => t.id == threadId) || getDefaultThreadData(threadId);
}

function updateThreadInStorage(threadData) {
    const threads = JSON.parse(localStorage.getItem('discussion_threads') || '[]');
    const index = threads.findIndex(t => t.id == threadData.id);
    if (index !== -1) {
        threads[index] = threadData;
        localStorage.setItem('discussion_threads', JSON.stringify(threads));
    }
}

function saveReplyToStorage(replyData) {
    const replies = JSON.parse(localStorage.getItem('discussion_replies') || '[]');
    replies.push(replyData);
    localStorage.setItem('discussion_replies', JSON.stringify(replies));
}

function getRepliesFromStorage(threadId) {
    const replies = JSON.parse(localStorage.getItem('discussion_replies') || '[]');
    return replies.filter(r => r.threadId == threadId);
}

// UI Functions
function createThreadElement(threadData) {
    const threadsContainer = document.querySelector('.threads-container');
    if (!threadsContainer) return;
    
    const threadDiv = document.createElement('div');
    threadDiv.className = 'thread';
    threadDiv.dataset.id = threadData.id;
    
    threadDiv.innerHTML = `
        <div class="thread-header">
            <span class="thread-id">#${threadData.id}</span>
            <span class="thread-title">${escapeHtml(threadData.title)}</span>
            <span class="thread-meta">Posts: ${threadData.posts} | Last: ${threadData.timestamp}</span>
        </div>
        <div class="thread-preview">
            <div class="post">
                <div class="post-header">
                    <span class="poster">${escapeHtml(threadData.author)}</span>
                    <span class="post-time">${threadData.timestamp}</span>
                    <span class="post-id">#1</span>
                </div>
                <div class="post-content">
                    <p>${threadData.encrypted ? 
                        `<span style="color: #00cc00">[ENCRYPTED]</span> ${escapeHtml(threadData.content.substring(0, 100))}...` : 
                        escapeHtml(threadData.content.substring(0, 200))}${threadData.content.length > 200 ? '...' : ''}</p>
                    ${threadData.priority ? '<p style="color: #ff0000;">⚠️ PRIORITY THREAD</p>' : ''}
                    <p class="post-tags">[Tags: new, research, discussion]</p>
                </div>
            </div>
        </div>
        <button class="view-thread">VIEW THREAD (${threadData.posts} POSTS)</button>
    `;
    
    // Insert after the "ACTIVE THREADS" title
    const titleElement = threadsContainer.querySelector('h3');
    if (titleElement) {
        titleElement.parentNode.insertBefore(threadDiv, titleElement.nextSibling);
    }
    
    // Add view functionality
    threadDiv.querySelector('.view-thread').addEventListener('click', function() {
        openThreadViewer(threadData, threadDiv);
    });
}

function updateThreadPostCount(threadId, count) {
    const threadElement = document.querySelector(`.thread[data-id="${threadId}"]`);
    if (threadElement) {
        const meta = threadElement.querySelector('.thread-meta');
        const viewBtn = threadElement.querySelector('.view-thread');
        
        if (meta) {
            meta.textContent = meta.textContent.replace(/Posts: \d+/, `Posts: ${count}`);
        }
        if (viewBtn) {
            viewBtn.textContent = `VIEW THREAD (${count} POSTS)`;
        }
    }
}

function updateBoardStats() {
    const threads = JSON.parse(localStorage.getItem('discussion_threads') || '[]');
    const totalPosts = threads.reduce((sum, thread) => sum + thread.posts, 0);
    
    const statsElement = document.querySelector('.board-stats span');
    if (statsElement) {
        statsElement.textContent = `Threads: ${threads.length} | Posts: ${totalPosts} | Online: ${Math.floor(Math.random() * 50) + 10}`;
    }
}

function loadSavedThreads() {
    const threads = JSON.parse(localStorage.getItem('discussion_threads') || '[]');
    
    // Only load if we have saved threads and the page is empty
    const existingThreads = document.querySelectorAll('.thread').length;
    if (threads.length > 0 && existingThreads <= 3) {
        threads.forEach(thread => {
            // Check if thread already exists
            const existing = document.querySelector(`.thread[data-id="${thread.id}"]`);
            if (!existing) {
                createThreadElement(thread);
            }
        });
        updateBoardStats();
    }
}

// Helper Functions
function getDefaultThreadData(threadId) {
    const defaultThreads = {
        1: {
            id: 1,
            title: 'Leicester 1817 - Was that REALLY Buratsov?',
            content: 'Cross-referencing the eyewitness accounts with the St. Petersburg initiation records. The height matches (6\'2") but the scar pattern doesn\'t align with the 1809 ritual accident. Could be a different prophet entirely. Thoughts?',
            author: 'Anonymous',
            timestamp: '12/15/2023 22:31',
            encrypted: false,
            priority: false,
            posts: 85
        },
        2: {
            id: 2,
            title: 'Nabazov\'s original manuscripts - translation debate',
            content: 'The Uzbek-to-Latin translation in the 1897 Berlin edition clearly mistranslates "eternal flame" as "purifying fire." This changes the entire soteriological framework. I\'ve uploaded my corrected translation to the archive.',
            author: 'Dr. Armitage',
            timestamp: '12/10/2023 14:45',
            encrypted: false,
            priority: false,
            posts: 128
        },
        3: {
            id: 3,
            title: 'RITUAL WARNING: Upcoming solstice alignment',
            content: 'Pattern analysis suggests high probability of Liberation activity during winter solstice. Multiple historical ascensions correlate with celestial alignments. All field researchers maintain heightened awareness Dec 20-23.',
            author: 'SiteAdmin',
            timestamp: '12/01/2023 08:00',
            encrypted: false,
            priority: true,
            posts: 43
        }
    };
    
    return defaultThreads[threadId] || {
        id: threadId,
        title: 'Thread not found',
        content: 'This thread could not be loaded.',
        author: 'System',
        timestamp: getCurrentDate(),
        encrypted: false,
        priority: false,
        posts: 1
    };
}

function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('#notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            max-width: 300px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        success: { bg: '#003300', border: '#00cc00', text: '#00ff00' },
        error: { bg: '#330000', border: '#ff0000', text: '#ff6666' },
        info: { bg: '#000033', border: '#0066ff', text: '#6699ff' },
        warning: { bg: '#663300', border: '#ff9900', text: '#ffcc00' }
    };
    
    const color = colors[type] || colors.info;
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        padding: 10px 15px;
        margin-bottom: 10px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    
    notification.textContent = message;
    
    const container = document.querySelector('#notification-container') || document.body;
    container.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add CSS animations if not present
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility Functions
function nabazovCipher(text) {
    const substitutions = {
        // Letters
        'a': 'α', 'b': 'β', 'c': 'ψ', 'd': 'δ', 'e': 'ε',
        'f': 'φ', 'g': 'γ', 'h': 'ͱ', 'i': 'ι', 'j': 'ξ',
        'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ω',
        'p': 'π', 'q': 'θ', 'r': 'ρ', 's': 'σ', 't': 'τ',
        'u': 'υ', 'v': 'ⅎ', 'w': 'ϝ', 'x': 'χ', 'y': 'η', 'z': 'ζ',
        // Capital letters (different symbols)
        'A': 'Ɑ', 'B': 'Ɓ', 'C': 'Ͼ', 'D': 'Ɖ', 'E': 'Ɛ',
        'F': 'Φ', 'G': 'Ɣ', 'H': 'Ƕ', 'I': 'Ɩ', 'J': 'Ϳ',
        'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ω',
        'P': 'Ρ', 'Q': 'Ϙ', 'R': 'Ʀ', 'S': 'Ϲ', 'T': 'Τ',
        'U': 'Υ', 'V': 'Ⅎ', 'W': 'Ϝ', 'X': 'Χ', 'Y': 'Η', 'Z': 'Ζ',
        // Numbers
        '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
        '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
        // Punctuation and symbols
        ' ': '⏣', '.': '●', ',': '⸴', '!': '⚡', '?': '⍰',
        ':': '꞉', ';': ';', '(': '⦅', ')': '⦆', '[': '⟦',
        ']': '⟧', '{': '⦃', '}': '⦄', '<': '⟨', '>': '⟩',
        '"': '«', "'": '‹', '-': '–', '_': '‗', '=': '═',
        '+': '⊕', '*': '⊗', '/': '⧸', '\\': '⧹', '|': '‖',
        '@': 'ⓐ', '#': '⌗', '$': '💲', '%': '٪', '&': '⅋',
        '^': '↑', '~': '∼', '`': '‵',
        // New lines and tabs
        '\n': '\n', '\t': '\t'
    };
    
    return text.toLowerCase().split('').map(char => {
        return substitutions[char] || char;
    }).join('');
}

function getCurrentDate() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
}

function getRandomName() {
    const names = [
        'Anonymous', 'Researcher', 'Archivist', 'Historian', 'Scholar',
        'Agent_Alpha', 'Field_Researcher', 'Occultist', 'Theologian',
        'Dr._Armitage', 'RES-042', 'RES-023', 'RES-017'
    ];
    const numbers = Math.floor(Math.random() * 999);
    return `${names[Math.floor(Math.random() * names.length)]}_${numbers}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}