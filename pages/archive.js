// pages/archive_external.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('External archive system v2.0 loaded');
    
    // Initialize external file system
    initializeExternalArchive();
    
    // Load and display documents
    loadExternalDocuments();
    
    // Initialize document editor
    initializeDocumentEditor();
});

function initializeExternalArchive() {
    // Update timestamps
    updateTimestamps();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check file integrity
    checkFileIntegrity();
}

function updateTimestamps() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    
    // Update all timestamps
    document.getElementById('lastScanTime').textContent = timeString;
    document.getElementById('syncTime').textContent = 'Just now';
    document.getElementById('footerScanTime').textContent = timeString;
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('archiveSearch');
    const searchButton = document.querySelector('.search-box button');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchButton) {
        searchButton.addEventListener('click', searchArchive);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArchive();
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterByCategory);
    }
    
    // Document buttons (delegated)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-doc')) {
            const filename = e.target.dataset.filename;
            viewExternalDocument(filename);
        }
        
        if (e.target.classList.contains('edit-doc')) {
            const filename = e.target.dataset.filename;
            editExternalDocument(filename);
        }
    });
    
    // File management buttons
    document.getElementById('refreshFiles').addEventListener('click', refreshFiles);
    document.getElementById('createNewDoc').addEventListener('click', createNewDocument);
    document.getElementById('openFolder').addEventListener('click', openDocumentsFolder);
    document.getElementById('exportAll').addEventListener('click', exportAllDocuments);
    
    // Editor buttons
    document.getElementById('closeEditor').addEventListener('click', closeEditor);
    document.getElementById('saveDocument').addEventListener('click', saveDocument);
    document.getElementById('revertDocument').addEventListener('click', revertDocument);
    document.getElementById('encryptDocument').addEventListener('click', encryptDocument);
    document.getElementById('decryptDocument').addEventListener('click', decryptDocument);
    
    // Update editor stats as user types
    document.getElementById('editorContent').addEventListener('input', updateEditorStats);
}

function loadExternalDocuments() {
    console.log('Loading external documents...');
    
    // For each document item, attempt to load file info
    const docItems = document.querySelectorAll('.doc-item');
    let loadedCount = 0;
    
    docItems.forEach(item => {
        const filename = item.dataset.file;
        const sizeElement = item.querySelector('.size-value');
        
        // In a real implementation, this would fetch from server
        // For local file system simulation, we'll use localStorage
        
        // Check if file exists in localStorage (simulated file system)
        const fileData = localStorage.getItem(`document_${filename}`);
        
        if (fileData) {
            // File exists in localStorage
            const size = fileData.length;
            sizeElement.textContent = formatFileSize(size);
            item.classList.add('file-loaded');
            loadedCount++;
        } else {
            // File doesn't exist yet - create default content
            const defaultContent = getDefaultDocumentContent(filename);
            localStorage.setItem(`document_${filename}`, defaultContent);
            sizeElement.textContent = formatFileSize(defaultContent.length);
            item.classList.add('file-loaded');
            loadedCount++;
        }
    });
    
    // Update document count
    document.getElementById('docCount').textContent = loadedCount;
    
    // Update integrity status
    document.getElementById('integrityStatus').textContent = 'PASSING';
    document.getElementById('integrityStatus').className = 'status-ok';
    
    console.log(`Loaded ${loadedCount} documents from simulated file system`);
}

function getDefaultDocumentContent(filename) {
    // Default content for each document file
    const defaults = {
        'nabazov_codex.txt': `THE NABAZOV CODEX (1682)

This is the primary sacred text of the Liberation cult.
Edit this file to add your own content about Nabazov's teachings.

The original manuscript was written in Chagatai (Middle Turkic)
and contains the complete ascension ritual that Nabazov used
to transcend mortal form in 1682.

Key sections:
1. The Seven True Names
2. The 77-day purification ritual
3. The circle of ash ceremony
4. The final incantation

[Add your own notes and translations here]`,

        'buratsov_journal.txt': `BURATSOV'S JOURNAL (1795-1817)

Personal journals of Kürschevan Fyodorovich Buratsov,
the Final Prophet of the Liberation cult.

Written in a mixture of Russian, French, and German,
these journals document his 22-year journey from
discovering Nabazov's texts to his own ascension
at Leicester Cathedral in 1817.

Notable entries include:
- First encounter with Nabazov's work (1795)
- Meeting with Mikhail Orlov (1802)
- St. Petersburg experiments (1809)
- Leicester preparations (1817)

[Edit to add your own analysis and translations]`,

        'flame_cleansing_protocols.txt': `FLAME CLEANSING PROTOCOLS

Standard purification rituals used by Liberation members.
Revised edition from 1815 by Kürschevan Buratsov.

PROTOCOL ALPHA (Basic Cleansing):
1. Prepare sacred ash circle
2. Light consecrated oil
3. Chant Mantra of Release for 7 minutes
4. Pass hands through flames
5. Extinguish with sand

PROTOCOL BETA (Advanced):
[REDACTED - Level 4 clearance required]

PROTOCOL GAMMA (Emergency):
For immediate decontamination when divine "taint" is detected.

WARNING: All protocols carry risk of injury or death.
Proper training and clearance required.`,

        'ascension_ritual_7.txt': `ASCENSION RITUAL #7

The complete ritual used by both Nabazov (1682) and
Buratsov (1817) to achieve apotheosis.

REQUIREMENTS:
- 77 days of preparation
- Circle of purified ash
- Knowledge of the Seven True Names
- Willing sacrifice (optional for Buratsov's version)

PROCEDURE:
[Section 1-6 redacted - Level 5 clearance required]

SECTION 7 - FINAL INCANTATION:
"From the flame of my ancestors,
I am free from all gods.
Let the prison of divinity burn,
And truth emerge from the ashes."

WARNING: 140 documented failures, all fatal.
Only 2 confirmed successes in history.`,

        'ash_baptism_ritual.txt': `ASH BAPTISM RITUAL

Standard initiation ceremony for new Liberation members.
Lowest risk of all documented rituals (2.3% fatality rate).

PROCEDURE:
1. Candidate stands naked in ceremonial chamber
2. Anointing with ash from previous rituals
3. Chanting of initiation vows
4. Symbolic burning of old identity
5. Receiving of Liberation name

VOWS:
"I renounce all divine shackles.
I seek liberation through flame.
I serve the truth of Nabazov.
My life for the burning of gods."

Duration: 1 day
Success rate: 97.7%
Clearance required: Level 2`,

        'leicester_cathedral_fire_1817.txt': `LEICESTER CATHEDRAL FIRE - 1817

Official report and eyewitness accounts of the event
where Kürschevan Buratsov achieved ascension.

DATE: October 17, 1817
TIME: Approximately 23:45
LOCATION: Leicester Cathedral, England

EYEWITNESSES:
- Thomas Miller (night watchman)
- Sarah Jenkins (neighbor)
- Reverend Charles Whitmore

DESCRIPTION:
Blue-white flames erupted in the eastern wing.
No smoke production until final stages.
Figure approximately 6'2" observed at epicenter.
Chanting heard in unknown language.
No human remains found in ashes.

ANALYSIS:
Pattern matches Ascension Ritual #7.
Thermal signatures consistent with Nabazov rituals.
Confirmed as Buratsov's successful transcendence.`,

        'st_petersburg_circle_records.txt': `ST. PETERSBURG CIRCLE RECORDS

Complete membership and activity records of the
Liberation occult circle that operated in St. Petersburg
from 1795 to 1809.

MEMBERS:
1. Kürschevan F. Buratsov (joined 1802)
2. Mikhail Orlov (leader, executed 1799)
3. Anna Petrovna (scribe)
4. Ivan Smirnov (financier)
5. Pyotr Kuznetsov (researcher)
6. Elena Volkova (recruiter)
7. Grigori Popov (security)

ACTIVITIES:
- Weekly meetings at Orlov's estate
- Translation of Nabazov manuscripts
- Ritual experiments (3 fatal)
- Correspondence with European occultists
- Evasion of Tsarist authorities

DISBANDED: 1809 after police raid
SURVIVORS: Only Buratsov confirmed`,

        'correspondence_buratsov_linz.txt': `CORRESPONDENCE: BURATSOV-LINZ (1802-1816)

14 years of private letters between Kürschevan Buratsov
and Dr. Johann Linz, German theologian and occultist.

KEY THEMES:
- Translation disputes of Nabazov texts
- Theological implications of deicide
- Practical ritual modifications
- Evading European authorities
- Preparation for Leicester ascension

NOTABLE LETTERS:
- March 15, 1809: "The St. Petersburg experiment failed..."
- December 3, 1815: "I have revised the seventh name..."
- September 22, 1816: "Leicester site shows promise..."
- October 10, 1817: "Final preparations complete..."

LAST LETTER: October 16, 1817
Buratsov's final communication before ascension.`,

        'thermal_pattern_analysis.txt': `THERMAL PATTERN ANALYSIS

Scientific analysis of heat signatures from
confirmed Liberation ritual sites.

METHOD:
Thermal imaging of 14 sites across Europe and Asia.
Comparison with conventional combustion patterns.

FINDINGS:
1. Spherical heat distribution (15ft radius)
2. Core temperature: 2800-3200°F
3. No intermediate gradient
4. Sharp boundary at radius edge
5. Heat persists 7-77 hours post-ritual

CONCLUSION:
Patterns inconsistent with chemical combustion.
Supports "focused energy release" hypothesis.
Suggests manipulation of fundamental forces.

IMPLICATIONS:
If reproducible, could revolutionize energy production.
Extreme danger - all attempts at replication failed.`,

        'cognitohazard_study_2022.txt': `COGNITOHAZARD STUDY (2022)

Research into the psychological effects of
exposure to Nabazov texts.

METHOD:
Double-blind study with 42 subjects.
Experimental group exposed to Codex for 1 hour daily.
Control group exposed to control texts.

RESULTS - EXPERIMENTAL GROUP:
94% reported vivid fire dreams
67% developed memory flashes
42% gained Chagatai understanding
220% pattern recognition improvement
2 subjects required psychiatric intervention
1 attempted self-immolation (intervened)

CONCLUSION:
Nabazov texts function as Class B cognitohazard.
Cause measurable neural restructuring.
Information-based reality alteration suspected.

RECOMMENDATION:
Restrict access to Level 4 clearance minimum.
Implement mandatory psychological screening.`,

        'multiverse_theory_nabazov.txt': `MULTIVERSE THEORY - NABAZOV

Analysis of Nabazov's references to multidimensional
existence and ascension beyond physical reality.

KEY CONCEPTS FROM THE CODEX:
- "The veil between worlds grows thin in flame"
- "Seven gates correspond to seven names"
- "Ascension is not death but translation"
- "The true self exists in all dimensions"

INTERPRETATION:
Nabazov may have discovered method of
dimensional translation through ritual.
Buratsov's "immortality" may be perpetual
existence across multiple realities.
"God killing" may refer to eliminating
dimensional parasites or limitations.

EVIDENCE:
- No remains after successful ascensions
- Buratsov sightings across 200+ years
- Consistent descriptions despite time gaps
- Thermal patterns suggest dimensional rupture

THEORY:
Successful ascension allows consciousness
to exist simultaneously in multiple realities.
"Gods" are dimensional entities that restrict
this multiversal existence.`
    };
    
    return defaults[filename] || `DOCUMENT: ${filename}

This is a placeholder document.
Edit this file to add your own content.

Created: ${new Date().toISOString()}
Clearance: ${document.querySelector(`.doc-item[data-file="${filename}"]`)?.dataset.clearance || 'Unknown'}
Category: ${document.querySelector(`.doc-item[data-file="${filename}"]`)?.closest('.category')?.dataset.category || 'Unknown'}

[Add your content here]`;
}

function viewExternalDocument(filename) {
    console.log(`Viewing document: ${filename}`);
    
    // Get document content from localStorage
    const content = localStorage.getItem(`document_${filename}`) || 
                   getDefaultDocumentContent(filename);
    
    // Create viewer modal
    const viewer = document.createElement('div');
    viewer.id = 'documentViewer';
    viewer.style.cssText = `
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
    
    // Get document metadata
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    const title = docItem ? docItem.querySelector('h4').textContent : filename;
    const clearance = docItem ? docItem.dataset.clearance : 'Unknown';
    const category = docItem ? docItem.closest('.category').querySelector('h3').textContent : 'Unknown';
    
    viewer.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 3px double #cc9900; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #cc9900; padding-bottom: 10px;">
                <h2 style="color: #ff9900; margin: 0;">${escapeHtml(title)}</h2>
                <button id="closeViewer" style="background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace;">CLOSE</button>
            </div>
            
            <div style="margin-bottom: 20px; color: #999; font-size: 12px;">
                <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                    <span><strong>File:</strong> ${escapeHtml(filename)}</span>
                    <span><strong>Clearance:</strong> Level ${clearance}</span>
                    <span><strong>Category:</strong> ${escapeHtml(category)}</span>
                </div>
                <div><strong>Size:</strong> ${formatFileSize(content.length)}</div>
                <div><strong>Last modified:</strong> ${getLastModified(filename)}</div>
            </div>
            
            <div style="background: #111; border: 1px solid #333; padding: 20px; margin-bottom: 20px;">
                <div style="color: #00cc00; font-size: 11px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <span>🔒 DECRYPTION COMPLETE</span>
                    <span style="color: #999;">|</span>
                    <span>Nabazov Cipher: DISABLED (plaintext mode)</span>
                </div>
                <div style="color: #cccccc; line-height: 1.6; white-space: pre-wrap; font-family: 'Courier New', monospace; max-height: 60vh; overflow-y: auto; padding: 10px; background: #000;">
                    ${escapeHtml(content)}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="editThisDocument" style="background: #003300; color: #00cc00; border: 2px outset #006600; padding: 10px 20px; cursor: pointer; font-family: monospace;">✏️ EDIT THIS FILE</button>
                <button id="downloadThisDocument" style="background: #000033; color: #6699ff; border: 2px outset #003366; padding: 10px 20px; cursor: pointer; font-family: monospace;">💾 DOWNLOAD</button>
                <button id="printThisDocument" style="background: #330033; color: #cc66cc; border: 2px outset #660066; padding: 10px 20px; cursor: pointer; font-family: monospace;">🖨️ PRINT</button>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #111; border: 1px solid #333; font-size: 11px; color: #999;">
                <strong>File System Information:</strong><br>
                Storage: Local simulated file system | Format: Plain text | 
                Encoding: UTF-8 | Path: /documents/${escapeHtml(filename)}
            </div>
        </div>
    `;
    
    document.body.appendChild(viewer);
    
    // Add event listeners
    viewer.querySelector('#closeViewer').addEventListener('click', () => {
        document.body.removeChild(viewer);
    });
    
    viewer.querySelector('#editThisDocument').addEventListener('click', () => {
        document.body.removeChild(viewer);
        editExternalDocument(filename);
    });
    
    viewer.querySelector('#downloadThisDocument').addEventListener('click', () => {
        downloadDocument(filename, content);
    });
    
    viewer.querySelector('#printThisDocument').addEventListener('click', () => {
        window.print();
    });
    
    // Close on ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(viewer);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

function editExternalDocument(filename) {
    console.log(`Editing document: ${filename}`);
    
    // Get document content
    const content = localStorage.getItem(`document_${filename}`) || 
                   getDefaultDocumentContent(filename);
    
    // Get document metadata
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    const title = docItem ? docItem.querySelector('h4').textContent : filename;
    
    // Update editor modal
    document.getElementById('editorTitle').textContent = `EDIT: ${title}`;
    document.getElementById('editingFilename').textContent = filename;
    document.getElementById('editingPath').textContent = `/documents/${filename}`;
    document.getElementById('editingModified').textContent = getLastModified(filename);
    document.getElementById('editorContent').value = content;
    
    // Update stats
    updateEditorStats();
    
    // Store current filename for saving
    document.getElementById('editorContent').dataset.currentFile = filename;
    
    // Show editor
    document.getElementById('documentEditor').style.display = 'block';
}

function initializeDocumentEditor() {
    // Close editor when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('documentEditor');
        if (event.target === modal) {
            closeEditor();
        }
    });
}

function closeEditor() {
    document.getElementById('documentEditor').style.display = 'none';
    // Clear current file
    document.getElementById('editorContent').dataset.currentFile = '';
}

function saveDocument() {
    const filename = document.getElementById('editorContent').dataset.currentFile;
    const content = document.getElementById('editorContent').value;
    
    if (!filename) {
        alert('No file selected for saving.');
        return;
    }
    
    // Save to localStorage (simulated file system)
    localStorage.setItem(`document_${filename}`, content);
    
    // Update last modified timestamp
    localStorage.setItem(`modified_${filename}`, new Date().toISOString());
    
    // Update file size display
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    if (docItem) {
        const sizeElement = docItem.querySelector('.size-value');
        sizeElement.textContent = formatFileSize(content.length);
    }
    
    // Show success message
    showNotification(`Document "${filename}" saved successfully`, 'success');
    
    // Update editor timestamp
    document.getElementById('editingModified').textContent = getLastModified(filename);
}

function revertDocument() {
    const filename = document.getElementById('editorContent').dataset.currentFile;
    
    if (!filename) {
        alert('No file selected for reverting.');
        return;
    }
    
    if (confirm('Are you sure you want to revert to the last saved version? All unsaved changes will be lost.')) {
        // Get original content
        const originalContent = localStorage.getItem(`document_${filename}`) || 
                              getDefaultDocumentContent(filename);
        
        // Update editor
        document.getElementById('editorContent').value = originalContent;
        updateEditorStats();
        
        showNotification('Document reverted to last saved version', 'info');
    }
}

function encryptDocument() {
    const content = document.getElementById('editorContent').value;
    const encrypted = nabazovCipher(content);
    document.getElementById('editorContent').value = encrypted;
    updateEditorStats();
    showNotification('Document encrypted with Nabazov cipher', 'info');
}

function decryptDocument() {
    const content = document.getElementById('editorContent').value;
    // Note: In a real implementation, you'd have a proper decryption function
    // For now, we'll just show a message
    showNotification('Decryption requires Level 5 clearance and ritual preparation', 'warning');
}

function updateEditorStats() {
    const content = document.getElementById('editorContent').value;
    const charCount = content.length;
    const lineCount = content.split('\n').length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    document.getElementById('charCount').textContent = charCount;
    document.getElementById('lineCount').textContent = lineCount;
    document.getElementById('wordCount').textContent = wordCount;
}

function refreshFiles() {
    showNotification('Refreshing document list...', 'info');
    
    // Reload all documents
    loadExternalDocuments();
    
    // Update timestamp
    updateTimestamps();
    
    // Show completion
    setTimeout(() => {
        showNotification('Document list refreshed successfully', 'success');
    }, 1000);
}

function createNewDocument() {
    const filename = prompt('Enter new document filename (with .txt extension):', 'new_document.txt');
    
    if (!filename) return;
    
    // Validate filename
    if (!filename.endsWith('.txt')) {
        alert('Filename must end with .txt extension');
        return;
    }
    
    // Check if already exists
    if (localStorage.getItem(`document_${filename}`)) {
        alert('A document with that filename already exists.');
        return;
    }
    
    // Get category
    const category = prompt('Enter category (core, rituals, history, analysis):', 'core');
    const validCategories = ['core', 'rituals', 'history', 'analysis'];
    
    if (!validCategories.includes(category)) {
        alert('Invalid category. Using "core" as default.');
        category = 'core';
    }
    
    // Get clearance level
    const clearance = prompt('Enter clearance level (1-5):', '3');
    if (!['1','2','3','4','5'].includes(clearance)) {
        alert('Invalid clearance level. Using "3" as default.');
        clearance = '3';
    }
    
    // Get title
    const title = prompt('Enter document title:', filename.replace('.txt', '').replace(/_/g, ' '));
    
    // Create default content
    const defaultContent = `# ${title}

Created: ${new Date().toISOString()}
Clearance: Level ${clearance}
Category: ${category}
Filename: ${filename}

[Add your content here]

---
Liberation Archive - External Document System
File automatically generated.`;

    // Save to localStorage
    localStorage.setItem(`document_${filename}`, defaultContent);
    localStorage.setItem(`modified_${filename}`, new Date().toISOString());
    
    // Create new document item in UI
    addDocumentToUI(filename, title, category, clearance, defaultContent.length);
    
    showNotification(`Document "${filename}" created successfully`, 'success');
}

function addDocumentToUI(filename, title, category, clearance, size) {
    // Find the appropriate category container
    const categoryContainer = document.querySelector(`.category[data-category="${category}"] .doc-grid`);
    
    if (!categoryContainer) {
        alert('Category container not found. Document created but not displayed.');
        return;
    }
    
    // Create new document element
    const docItem = document.createElement('div');
    docItem.className = 'doc-item';
    docItem.dataset.file = filename;
    docItem.dataset.clearance = clearance;
    
    docItem.innerHTML = `
        <div class="doc-icon">📄</div>
        <div class="doc-info">
            <h4>${escapeHtml(title)}</h4>
            <p class="doc-meta">New document | Clearance: Level ${clearance}</p>
            <p class="doc-desc">External document file. Edit to add content.</p>
            <button class="view-doc" data-filename="${filename}">VIEW</button>
            <button class="edit-doc" data-filename="${filename}">EDIT</button>
            <span class="file-size">Size: <span class="size-value">${formatFileSize(size)}</span></span>
        </div>
    `;
    
    // Add to category
    categoryContainer.appendChild(docItem);
    
    // Update document count
    const currentCount = parseInt(document.getElementById('docCount').textContent);
    document.getElementById('docCount').textContent = currentCount + 1;
}

function openDocumentsFolder() {
    // In a real implementation, this would open the file explorer
    // For now, we'll show a simulated file explorer
    
    const fileList = document.createElement('div');
    fileList.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #0a0a0a;
        border: 3px double #cc9900;
        padding: 20px;
        z-index: 10001;
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
    `;
    
    // Get all documents from localStorage
    let fileItems = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('document_')) {
            const filename = key.replace('document_', '');
            const content = localStorage.getItem(key);
            const size = formatFileSize(content.length);
            const modified = getLastModified(filename);
            
            fileItems += `
                <div style="padding: 10px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="color: #ccccff; font-weight: bold;">${escapeHtml(filename)}</div>
                        <div style="color: #999; font-size: 11px;">${size} | Modified: ${modified}</div>
                    </div>
                    <button class="open-file-btn" data-filename="${filename}" style="background: #003300; color: #00cc00; border: 1px solid #006600; padding: 5px 10px; cursor: pointer; font-size: 12px;">OPEN</button>
                </div>
            `;
        }
    }
    
    fileList.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #cc9900; padding-bottom: 10px;">
            <h3 style="color: #ff9900; margin: 0;">📂 DOCUMENTS FOLDER</h3>
            <button id="closeFileList" style="background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace;">CLOSE</button>
        </div>
        
        <div style="color: #999; margin-bottom: 20px;">
            <p>Simulated file system view. In a real implementation, this would open your system's file explorer.</p>
            <p>Path: <code>/documents/</code> | Files: ${document.getElementById('docCount').textContent}</p>
        </div>
        
        <div style="margin-bottom: 20px; max-height: 50vh; overflow-y: auto;">
            ${fileItems || '<p style="color: #999; text-align: center;">No documents found</p>'}
        </div>
        
        <div style="text-align: center;">
            <button id="refreshFileList" style="background: #000033; color: #6699ff; border: 1px solid #003366; padding: 8px 15px; margin: 0 5px; cursor: pointer;">REFRESH</button>
            <button id="createFileFromList" style="background: #003300; color: #00cc00; border: 1px solid #006600; padding: 8px 15px; margin: 0 5px; cursor: pointer;">NEW FILE</button>
        </div>
    `;
    
    document.body.appendChild(fileList);
    
    // Add event listeners
    fileList.querySelector('#closeFileList').addEventListener('click', () => {
        document.body.removeChild(fileList);
    });
    
    fileList.querySelector('#refreshFileList').addEventListener('click', () => {
        document.body.removeChild(fileList);
        openDocumentsFolder(); // Refresh
    });
    
    fileList.querySelector('#createFileFromList').addEventListener('click', () => {
        document.body.removeChild(fileList);
        createNewDocument();
    });
    
    // Add open buttons functionality
    fileList.querySelectorAll('.open-file-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filename = this.dataset.filename;
            document.body.removeChild(fileList);
            editExternalDocument(filename);
        });
    });
    
    // Close on ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(fileList)) {
                document.body.removeChild(fileList);
            }
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

function exportAllDocuments() {
    if (confirm('Export all documents as a ZIP file?')) {
        // Create export data
        const exportData = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('document_')) {
                const filename = key.replace('document_', '');
                exportData[filename] = localStorage.getItem(key);
            }
        }
        
        // Create JSON string
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liberation_archive_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('All documents exported as JSON', 'success');
    }
}

function checkFileIntegrity() {
    // Simulate file integrity check
    setTimeout(() => {
        const statusElement = document.getElementById('integrityStatus');
        const random = Math.random();
        
        if (random > 0.1) {
            // 90% chance of passing
            statusElement.textContent = 'PASSING';
            statusElement.className = 'status-ok';
        } else {
            // 10% chance of warning
            statusElement.textContent = 'CHECK REQUIRED';
            statusElement.className = 'status-warning';
            showNotification('File integrity check recommended', 'warning');
        }
    }, 2000);
}

function searchArchive() {
    const searchInput = document.getElementById('archiveSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showNotification('Please enter a search term.', 'warning');
        return;
    }
    
    const docItems = document.querySelectorAll('.doc-item');
    let results = 0;
    
    docItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('.doc-desc').textContent.toLowerCase();
        const filename = item.dataset.file.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || filename.includes(searchTerm)) {
            item.style.display = 'flex';
            item.style.animation = 'highlight 2s';
            results++;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (results === 0) {
        showNotification(`No documents found for "${searchTerm}"`, 'error');
        setTimeout(() => {
            docItems.forEach(item => {
                item.style.display = 'flex';
                item.style.animation = '';
            });
        }, 2000);
    } else {
        showNotification(`Found ${results} document(s) matching "${searchTerm}"`, 'success');
    }
}

function filterByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    const categories = document.querySelectorAll('.category');
    
    if (selectedCategory === 'all') {
        categories.forEach(cat => {
            cat.style.display = 'block';
            cat.querySelectorAll('.doc-item').forEach(item => {
                item.style.display = 'flex';
            });
        });
        showNotification('Showing all documents', 'info');
    } else {
        categories.forEach(cat => {
            if (cat.dataset.category === selectedCategory) {
                cat.style.display = 'block';
                cat.querySelectorAll('.doc-item').forEach(item => {
                    item.style.display = 'flex';
                });
            } else {
                cat.style.display = 'none';
            }
        });
        
        showNotification(`Filtered by: ${selectedCategory}`, 'info');
    }
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getLastModified(filename) {
    const modified = localStorage.getItem(`modified_${filename}`);
    if (modified) {
        const date = new Date(modified);
        return date.toLocaleString();
    }
    return 'Unknown';
}

function downloadDocument(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Downloaded: ${filename}`, 'success');
}

function showNotification(message, type = 'info') {
    // Use global notification system from script.js
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // Fallback if global function not available
        alert(message);
    }
}

// Add highlight animation to CSS if not present
if (!document.querySelector('#highlight-animation')) {
    const style = document.createElement('style');
    style.id = 'highlight-animation';
    style.textContent = `
        @keyframes highlight {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(255, 153, 0, 0.3); }
        }
        .status-ok { color: #00cc00; }
        .status-warning { color: #ff9900; animation: blink 1s infinite; }
        .file-loaded { border-left: 3px solid #00cc00; }
    `;
    document.head.appendChild(style);
}
// pages/archive_external.js - ENHANCED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('External archive system v2.1 loaded');
    
    // Initialize external file system
    initializeExternalArchive();
    
    // Load and display documents
    loadExternalDocuments();
});

function initializeExternalArchive() {
    // Update timestamps
    updateTimestamps();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check file integrity
    checkFileIntegrity();
}

function updateTimestamps() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    
    // Update all timestamps
    document.getElementById('lastScanTime').textContent = timeString;
    document.getElementById('syncTime').textContent = 'Just now';
    document.getElementById('footerScanTime').textContent = timeString;
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('archiveSearch');
    const searchButton = document.querySelector('.search-box button');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchButton) {
        searchButton.addEventListener('click', searchArchive);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArchive();
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterByCategory);
    }
    
    // Document buttons (delegated)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-doc')) {
            const filename = e.target.dataset.filename;
            viewExternalDocument(filename);
        }
        
        if (e.target.classList.contains('edit-doc')) {
            const filename = e.target.dataset.filename;
            openDocumentEditor(filename);
        }
    });
    
    // File management buttons
    document.getElementById('refreshFiles').addEventListener('click', refreshFiles);
    document.getElementById('createNewDoc').addEventListener('click', createNewDocument);
    document.getElementById('openFolder').addEventListener('click', openDocumentsFolder);
    document.getElementById('exportAll').addEventListener('click', exportAllDocuments);
}

function loadExternalDocuments() {
    console.log('Loading external documents...');
    
    // For each document item, attempt to load file info
    const docItems = document.querySelectorAll('.doc-item');
    let loadedCount = 0;
    
    docItems.forEach(item => {
        const filename = item.dataset.file;
        const sizeElement = item.querySelector('.size-value');
        
        // Check if file exists in localStorage (simulated file system)
        const fileData = localStorage.getItem(`document_${filename}`);
        
        if (fileData) {
            // File exists in localStorage
            const size = fileData.length;
            sizeElement.textContent = formatFileSize(size);
            item.classList.add('file-loaded');
            loadedCount++;
            
            // Check if file is encrypted
            if (isEncrypted(fileData)) {
                item.classList.add('encrypted');
                const icon = item.querySelector('.doc-icon');
                icon.textContent = '🔒';
                icon.title = 'Encrypted document';
            }
        } else {
            // File doesn't exist yet - create default content
            const defaultContent = getDefaultDocumentContent(filename);
            localStorage.setItem(`document_${filename}`, defaultContent);
            sizeElement.textContent = formatFileSize(defaultContent.length);
            item.classList.add('file-loaded');
            loadedCount++;
        }
    });
    
    // Update document count
    document.getElementById('docCount').textContent = loadedCount;
    
    // Update integrity status
    document.getElementById('integrityStatus').textContent = 'PASSING';
    document.getElementById('integrityStatus').className = 'status-ok';
    
    console.log(`Loaded ${loadedCount} documents from simulated file system`);
}

function isEncrypted(content) {
    // Check if content appears to be Nabazov cipher encrypted
    // Looks for cipher characters like α, β, ψ, etc.
    const cipherChars = /[αβψδεφγηιξκλμνωπθρστυϝχζ⏣●⸴⚡⍰⓪①②③④⑤⑥⑦⑧⑨]/;
    return cipherChars.test(content);
}

function getDefaultDocumentContent(filename) {
    // Default content for each document file
    const defaults = {
        'nabazov_codex.txt': `THE NABAZOV CODEX (1682)

This is the primary sacred text of the Liberation cult.
Edit this file to add your own content about Nabazov's teachings.

The original manuscript was written in Chagatai (Middle Turkic)
and contains the complete ascension ritual that Nabazov used
to transcend mortal form in 1682.

Key sections:
1. The Seven True Names
2. The 77-day purification ritual
3. The circle of ash ceremony
4. The final incantation

[Add your own notes and translations here]`,

        'buratsov_journal.txt': `BURATSOV'S JOURNAL (1795-1817)

Personal journals of Kürschevan Fyodorovich Buratsov,
the Final Prophet of the Liberation cult.

Written in a mixture of Russian, French, and German,
these journals document his 22-year journey from
discovering Nabazov's texts to his own ascension
at Leicester Cathedral in 1817.

Notable entries include:
- First encounter with Nabazov's work (1795)
- Meeting with Mikhail Orlov (1802)
- St. Petersburg experiments (1809)
- Leicester preparations (1817)

[Edit to add your own analysis and translations]`,

        'flame_cleansing_protocols.txt': `FLAME CLEANSING PROTOCOLS

Standard purification rituals used by Liberation members.
Revised edition from 1815 by Kürschevan Buratsov.

PROTOCOL ALPHA (Basic Cleansing):
1. Prepare sacred ash circle
2. Light consecrated oil
3. Chant Mantra of Release for 7 minutes
4. Pass hands through flames
5. Extinguish with sand

PROTOCOL BETA (Advanced):
[REDACTED - Level 4 clearance required]

PROTOCOL GAMMA (Emergency):
For immediate decontamination when divine "taint" is detected.

WARNING: All protocols carry risk of injury or death.
Proper training and clearance required.`
    };
    
    return defaults[filename] || `DOCUMENT: ${filename}

This is a placeholder document.
Edit this file to add your own content.

Created: ${new Date().toISOString()}
Clearance: ${document.querySelector(`.doc-item[data-file="${filename}"]`)?.dataset.clearance || 'Unknown'}
Category: ${document.querySelector(`.doc-item[data-file="${filename}"]`)?.closest('.category')?.dataset.category || 'Unknown'}

[Add your content here]`;
}

function viewExternalDocument(filename) {
    console.log(`Viewing document: ${filename}`);
    
    // Get document content from localStorage
    let content = localStorage.getItem(`document_${filename}`) || 
                   getDefaultDocumentContent(filename);
    
    const isEncryptedContent = isEncrypted(content);
    
    // Create viewer modal
    const viewer = document.createElement('div');
    viewer.id = 'documentViewer';
    viewer.style.cssText = `
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
    
    // Get document metadata
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    const title = docItem ? docItem.querySelector('h4').textContent : filename;
    const clearance = docItem ? docItem.dataset.clearance : 'Unknown';
    const category = docItem ? docItem.closest('.category').querySelector('h3').textContent : 'Unknown';
    
    viewer.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 3px double #cc9900; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #cc9900; padding-bottom: 10px;">
                <h2 style="color: #ff9900; margin: 0;">${escapeHtml(title)}</h2>
                <button id="closeViewer" style="background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace;">CLOSE</button>
            </div>
            
            <div style="margin-bottom: 20px; color: #999; font-size: 12px;">
                <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                    <span><strong>File:</strong> ${escapeHtml(filename)}</span>
                    <span><strong>Clearance:</strong> Level ${clearance}</span>
                    <span><strong>Category:</strong> ${escapeHtml(category)}</span>
                </div>
                <div><strong>Size:</strong> ${formatFileSize(content.length)}</div>
                <div><strong>Last modified:</strong> ${getLastModified(filename)}</div>
                <div><strong>Status:</strong> ${isEncryptedContent ? '<span style="color: #00cc00;">ENCRYPTED</span>' : '<span style="color: #ff9900;">PLAINTEXT</span>'}</div>
            </div>
            
            <div style="background: #111; border: 1px solid #333; padding: 20px; margin-bottom: 20px;">
                <div style="color: ${isEncryptedContent ? '#ff9900' : '#00cc00'}; font-size: 11px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <span>${isEncryptedContent ? '🔒 ENCRYPTED CONTENT' : '🔓 PLAINTEXT CONTENT'}</span>
                    <span style="color: #999;">|</span>
                    <span>Nabazov Cipher: ${isEncryptedContent ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
                <div style="color: #cccccc; line-height: 1.6; white-space: pre-wrap; font-family: 'Courier New', monospace; max-height: 60vh; overflow-y: auto; padding: 10px; background: #000; border: 1px solid #333;">
                    ${escapeHtml(content)}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button id="editThisDocument" style="background: #003300; color: #00cc00; border: 2px outset #006600; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;">✏️ EDIT</button>
                ${isEncryptedContent ? 
                    `<button id="decryptInViewer" style="background: #330033; color: #cc66cc; border: 2px outset #660066; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;">🔓 DECRYPT & VIEW</button>` : 
                    `<button id="encryptInViewer" style="background: #000033; color: #6699ff; border: 2px outset #003366; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;">🔒 ENCRYPT</button>`
                }
                <button id="downloadThisDocument" style="background: #003333; color: #00cccc; border: 2px outset #006666; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;">💾 DOWNLOAD</button>
                <button id="printThisDocument" style="background: #663300; color: #ff9900; border: 2px outset #996600; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;">🖨️ PRINT</button>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #111; border: 1px solid #333; font-size: 11px; color: #999;">
                <strong>File System Information:</strong><br>
                Storage: Local simulated file system | Format: Plain text | 
                Encoding: UTF-8 | Path: /documents/${escapeHtml(filename)}
            </div>
        </div>
    `;
    
    document.body.appendChild(viewer);
    
    // Add event listeners
    viewer.querySelector('#closeViewer').addEventListener('click', () => {
        document.body.removeChild(viewer);
    });
    
    viewer.querySelector('#editThisDocument').addEventListener('click', () => {
        document.body.removeChild(viewer);
        openDocumentEditor(filename);
    });
    
    if (isEncryptedContent) {
        viewer.querySelector('#decryptInViewer').addEventListener('click', () => {
            // Decrypt and show in viewer
            const decrypted = decryptNabazov(content);
            const contentDiv = viewer.querySelector('div[style*="white-space: pre-wrap"]');
            contentDiv.innerHTML = escapeHtml(decrypted);
            contentDiv.style.color = '#00ff00';
            contentDiv.style.background = '#001100';
            contentDiv.style.border = '1px solid #00cc00';
            
            // Update status
            const statusDiv = viewer.querySelector('div[style*="font-size: 11px"]');
            statusDiv.innerHTML = '<span style="color: #00cc00;">🔓 DECRYPTED CONTENT</span> <span style="color: #999;">|</span> <span>Nabazov Cipher: DISABLED</span>';
            
            // Replace decrypt button with encrypt button
            const decryptBtn = viewer.querySelector('#decryptInViewer');
            const newBtn = document.createElement('button');
            newBtn.id = 'encryptInViewer';
            newBtn.style.cssText = 'background: #000033; color: #6699ff; border: 2px outset #003366; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;';
            newBtn.textContent = '🔒 RE-ENCRYPT';
            newBtn.addEventListener('click', () => {
                const encrypted = encryptNabazov(decrypted);
                localStorage.setItem(`document_${filename}`, encrypted);
                contentDiv.innerHTML = escapeHtml(encrypted);
                contentDiv.style.color = '';
                contentDiv.style.background = '';
                contentDiv.style.border = '';
                
                // Update status
                statusDiv.innerHTML = '<span style="color: #ff9900;">🔒 ENCRYPTED CONTENT</span> <span style="color: #999;">|</span> <span>Nabazov Cipher: ACTIVE</span>';
                
                // Update document item in list
                const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
                if (docItem) {
                    docItem.classList.add('encrypted');
                    const icon = docItem.querySelector('.doc-icon');
                    icon.textContent = '🔒';
                }
                
                // Show success message
                showNotification(`Document "${filename}" re-encrypted`, 'success');
                
                // Replace button back
                newBtn.replaceWith(decryptBtn);
            });
            
            decryptBtn.replaceWith(newBtn);
            
            showNotification('Document decrypted successfully', 'success');
        });
    } else {
        viewer.querySelector('#encryptInViewer').addEventListener('click', () => {
            // Encrypt the document
            const encrypted = encryptNabazov(content);
            localStorage.setItem(`document_${filename}`, encrypted);
            
            // Update viewer content
            const contentDiv = viewer.querySelector('div[style*="white-space: pre-wrap"]');
            contentDiv.innerHTML = escapeHtml(encrypted);
            
            // Update status
            const statusDiv = viewer.querySelector('div[style*="font-size: 11px"]');
            statusDiv.innerHTML = '<span style="color: #ff9900;">🔒 ENCRYPTED CONTENT</span> <span style="color: #999;">|</span> <span>Nabazov Cipher: ACTIVE</span>';
            
            // Update document item in list
            const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
            if (docItem) {
                docItem.classList.add('encrypted');
                const icon = docItem.querySelector('.doc-icon');
                icon.textContent = '🔒';
            }
            
            // Replace encrypt button with decrypt button
            const encryptBtn = viewer.querySelector('#encryptInViewer');
            const newBtn = document.createElement('button');
            newBtn.id = 'decryptInViewer';
            newBtn.style.cssText = 'background: #330033; color: #cc66cc; border: 2px outset #660066; padding: 10px 20px; cursor: pointer; font-family: monospace; margin: 5px;';
            newBtn.textContent = '🔓 DECRYPT';
            newBtn.addEventListener('click', () => {
                // This would trigger the decrypt functionality
                // For now, just show a message
                showNotification('Use the EDIT function to decrypt and edit', 'info');
            });
            
            encryptBtn.replaceWith(newBtn);
            
            showNotification(`Document "${filename}" encrypted`, 'success');
        });
    }
    
    viewer.querySelector('#downloadThisDocument').addEventListener('click', () => {
        downloadDocument(filename, content);
    });
    
    viewer.querySelector('#printThisDocument').addEventListener('click', () => {
        window.print();
    });
    
    // Close on ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(viewer);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

function openDocumentEditor(filename) {
    console.log(`Opening editor for: ${filename}`);
    
    // Get document content
    let content = localStorage.getItem(`document_${filename}`) || 
                   getDefaultDocumentContent(filename);
    
    const isEncryptedContent = isEncrypted(content);
    
    // Get document metadata
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    const title = docItem ? docItem.querySelector('h4').textContent : filename;
    const clearance = docItem ? docItem.dataset.clearance : 'Unknown';
    
    // Create editor popup (similar to viewer)
    const editor = document.createElement('div');
    editor.id = 'documentEditorPopup';
    editor.style.cssText = `
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
    
    editor.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto; background: #0a0a0a; border: 3px double #cc9900; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #cc9900; padding-bottom: 10px;">
                <h2 style="color: #ff9900; margin: 0;">✏️ EDIT: ${escapeHtml(title)}</h2>
                <button id="closeEditorPopup" style="background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace;">CLOSE</button>
            </div>
            
            <div style="margin-bottom: 20px; color: #999; font-size: 12px;">
                <div style="display: flex; gap: 20px; margin-bottom: 10px; flex-wrap: wrap;">
                    <span><strong>File:</strong> ${escapeHtml(filename)}</span>
                    <span><strong>Clearance:</strong> Level ${clearance}</span>
                    <span><strong>Status:</strong> ${isEncryptedContent ? '<span style="color: #00cc00;">ENCRYPTED</span>' : '<span style="color: #ff9900;">PLAINTEXT</span>'}</span>
                    <span><strong>Size:</strong> ${formatFileSize(content.length)}</span>
                </div>
                <div><strong>Path:</strong> <code>/documents/${escapeHtml(filename)}</code></div>
                <div><strong>Last modified:</strong> ${getLastModified(filename)}</div>
            </div>
            
            <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="saveDocumentBtn" style="background: #003300; color: #00cc00; border: 2px outset #006600; padding: 10px 20px; cursor: pointer; font-family: monospace; flex: 1; min-width: 120px;">
                    💾 SAVE
                </button>
                <button id="revertDocumentBtn" style="background: #663300; color: #ff9900; border: 2px outset #996600; padding: 10px 20px; cursor: pointer; font-family: monospace; flex: 1; min-width: 120px;">
                    ↩️ REVERT
                </button>
                ${isEncryptedContent ? 
                    `<button id="decryptDocumentBtn" style="background: #330033; color: #cc66cc; border: 2px outset #660066; padding: 10px 20px; cursor: pointer; font-family: monospace; flex: 1; min-width: 120px;">
                        🔓 DECRYPT
                    </button>` : 
                    `<button id="encryptDocumentBtn" style="background: #000033; color: #6699ff; border: 2px outset #003366; padding: 10px 20px; cursor: pointer; font-family: monospace; flex: 1; min-width: 120px;">
                        🔒 ENCRYPT
                    </button>`
                }
                <button id="downloadDocumentBtn" style="background: #003333; color: #00cccc; border: 2px outset #006666; padding: 10px 20px; cursor: pointer; font-family: monospace; flex: 1; min-width: 120px;">
                    💾 DOWNLOAD
                </button>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; background: #111; padding: 10px; border: 1px solid #333;">
                <div style="color: #ff9900; font-size: 14px;">Document Content:</div>
                <div style="color: #999; font-size: 12px;">
                    <span id="charCount">0</span> chars • 
                    <span id="lineCount">0</span> lines • 
                    <span id="wordCount">0</span> words
                </div>
            </div>
            
            <textarea id="editorTextarea" 
                style="width: 100%; height: 50vh; background: #000; color: #cccccc; border: 2px solid #333; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5; resize: vertical;"
                placeholder="Edit document content here...">${escapeHtml(content)}</textarea>
            
            <div style="margin-top: 20px; padding: 15px; background: #111; border: 1px solid #333; font-size: 12px; color: #ff9999;">
                ⚠️ <strong>WARNING:</strong> Changes are saved to the simulated file system. 
                ${isEncryptedContent ? 'Document is encrypted. Decrypt before editing for best results.' : 'Document is in plaintext. Use encryption for sensitive content.'}
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #111; border: 1px solid #333; font-size: 11px; color: #999;">
                <strong>Editor Controls:</strong><br>
                • Ctrl+S: Quick Save • Ctrl+Z: Undo • Ctrl+Y: Redo • Ctrl+F: Find • Ctrl+D: Decrypt (if encrypted)
            </div>
        </div>
    `;
    
    document.body.appendChild(editor);
    
    // Focus the textarea
    const textarea = editor.querySelector('#editorTextarea');
    textarea.focus();
    
    // Update character count
    updateEditorStats(textarea);
    
    // Store original content for revert
    const originalContent = content;
    
    // Add event listeners
    editor.querySelector('#closeEditorPopup').addEventListener('click', () => {
        document.body.removeChild(editor);
    });
    
    editor.querySelector('#saveDocumentBtn').addEventListener('click', () => {
        saveDocument(filename, textarea.value, editor);
    });
    
    editor.querySelector('#revertDocumentBtn').addEventListener('click', () => {
        if (confirm('Revert to original content? All unsaved changes will be lost.')) {
            textarea.value = originalContent;
            updateEditorStats(textarea);
            showNotification('Document reverted to original', 'info');
        }
    });
    
    if (isEncryptedContent) {
        editor.querySelector('#decryptDocumentBtn').addEventListener('click', () => {
            // Decrypt the content in the editor
            const decrypted = decryptNabazov(textarea.value);
            textarea.value = decrypted;
            updateEditorStats(textarea);
            
            // Update button to show encrypt option
            const decryptBtn = editor.querySelector('#decryptDocumentBtn');
            decryptBtn.innerHTML = '🔒 ENCRYPT';
            decryptBtn.style.background = '#000033';
            decryptBtn.style.color = '#6699ff';
            decryptBtn.style.border = '2px outset #003366';
            decryptBtn.id = 'encryptDocumentBtn';
            
            // Update click handler for new encrypt button
            decryptBtn.addEventListener('click', function() {
                const encrypted = encryptNabazov(textarea.value);
                textarea.value = encrypted;
                updateEditorStats(textarea);
                
                // Update button back to decrypt
                this.innerHTML = '🔓 DECRYPT';
                this.style.background = '#330033';
                this.style.color = '#cc66cc';
                this.style.border = '2px outset #660066';
                this.id = 'decryptDocumentBtn';
                
                showNotification('Document encrypted', 'success');
            });
            
            showNotification('Document decrypted - ready for editing', 'success');
        });
    } else {
        editor.querySelector('#encryptDocumentBtn').addEventListener('click', () => {
            // Encrypt the content in the editor
            const encrypted = encryptNabazov(textarea.value);
            textarea.value = encrypted;
            updateEditorStats(textarea);
            
            // Update button to show decrypt option
            const encryptBtn = editor.querySelector('#encryptDocumentBtn');
            encryptBtn.innerHTML = '🔓 DECRYPT';
            encryptBtn.style.background = '#330033';
            encryptBtn.style.color = '#cc66cc';
            encryptBtn.style.border = '2px outset #660066';
            encryptBtn.id = 'decryptDocumentBtn';
            
            // Update click handler for new decrypt button
            encryptBtn.addEventListener('click', function() {
                const decrypted = decryptNabazov(textarea.value);
                textarea.value = decrypted;
                updateEditorStats(textarea);
                
                // Update button back to encrypt
                this.innerHTML = '🔒 ENCRYPT';
                this.style.background = '#000033';
                this.style.color = '#6699ff';
                this.style.border = '2px outset #003366';
                this.id = 'encryptDocumentBtn';
                
                showNotification('Document decrypted', 'success');
            });
            
            showNotification('Document encrypted', 'success');
        });
    }
    
    editor.querySelector('#downloadDocumentBtn').addEventListener('click', () => {
        downloadDocument(filename, textarea.value);
    });
    
    // Update stats as user types
    textarea.addEventListener('input', () => {
        updateEditorStats(textarea);
    });
    
    // Keyboard shortcuts
    textarea.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveDocument(filename, this.value, editor);
        }
        
        // Ctrl+D to decrypt (if encrypted)
        if (e.ctrlKey && e.key === 'd' && isEncryptedContent) {
            e.preventDefault();
            editor.querySelector('#decryptDocumentBtn')?.click();
        }
        
        // Ctrl+E to encrypt (if plaintext)
        if (e.ctrlKey && e.key === 'e' && !isEncryptedContent) {
            e.preventDefault();
            editor.querySelector('#encryptDocumentBtn')?.click();
        }
    });
    
    // Close on ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(editor)) {
                // Check for unsaved changes
                if (textarea.value !== originalContent) {
                    if (confirm('You have unsaved changes. Close anyway?')) {
                        document.body.removeChild(editor);
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                } else {
                    document.body.removeChild(editor);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            }
        }
    });
}

function updateEditorStats(textarea) {
    const content = textarea.value;
    const charCount = content.length;
    const lineCount = content.split('\n').length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    const editor = document.querySelector('#documentEditorPopup');
    if (editor) {
        editor.querySelector('#charCount').textContent = charCount.toLocaleString();
        editor.querySelector('#lineCount').textContent = lineCount.toLocaleString();
        editor.querySelector('#wordCount').textContent = wordCount.toLocaleString();
    }
}

function saveDocument(filename, content, editor) {
    // Save to localStorage (simulated file system)
    localStorage.setItem(`document_${filename}`, content);
    
    // Update last modified timestamp
    localStorage.setItem(`modified_${filename}`, new Date().toISOString());
    
    // Update file size display in main list
    const docItem = document.querySelector(`.doc-item[data-file="${filename}"]`);
    if (docItem) {
        const sizeElement = docItem.querySelector('.size-value');
        sizeElement.textContent = formatFileSize(content.length);
        
        // Update encryption status
        if (isEncrypted(content)) {
            docItem.classList.add('encrypted');
            const icon = docItem.querySelector('.doc-icon');
            icon.textContent = '🔒';
            icon.title = 'Encrypted document';
        } else {
            docItem.classList.remove('encrypted');
            const icon = docItem.querySelector('.doc-icon');
            icon.textContent = '📄';
            icon.title = '';
        }
    }
    
    // Show success message
    showNotification(`Document "${filename}" saved successfully`, 'success');
    
    // Update editor timestamp if still open
    if (editor && editor.querySelector('div[style*="Last modified"]')) {
        const modifiedElement = Array.from(editor.querySelectorAll('div')).find(el => 
            el.textContent.includes('Last modified')
        );
        if (modifiedElement) {
            modifiedElement.innerHTML = modifiedElement.innerHTML.replace(
                /Last modified:.*/,
                `Last modified: ${getLastModified(filename)}`
            );
        }
    }
}

// Enhanced Nabazov Cipher Functions
function encryptNabazov(text) {
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
    
    // Create reverse lookup for decryption
    if (!window.nabazovDecryptMap) {
        window.nabazovDecryptMap = {};
        for (const [key, value] of Object.entries(substitutions)) {
            window.nabazovDecryptMap[value] = key;
        }
        // Special case for newline
        window.nabazovDecryptMap['↵'] = '';
    }
    
    return text.split('').map(char => {
        return substitutions[char] || char;
    }).join('');
}

function decryptNabazov(text) {
    // Ensure decrypt map exists
    if (!window.nabazovDecryptMap) {
        // Initialize by calling encrypt once
        encryptNabazov('a');
    }
    
    // Handle special newline symbol
    text = text.replace(/↵\n/g, '\n');
    
    return text.split('').map(char => {
        return window.nabazovDecryptMap[char] || char;
    }).join('');
}

// Rest of the functions remain the same as before (refreshFiles, createNewDocument, etc.)
// [Include all the remaining functions from the previous archive_external.js here]
// Functions to include:
// - refreshFiles()
// - createNewDocument()
// - addDocumentToUI()
// - openDocumentsFolder()
// - exportAllDocuments()
// - checkFileIntegrity()
// - searchArchive()
// - filterByCategory()
// - formatFileSize()
// - getLastModified()
// - downloadDocument()
// - showNotification()