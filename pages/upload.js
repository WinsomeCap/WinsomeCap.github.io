// pages/upload.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Upload system v1.0 loaded');
    
    // Initialize upload system
    initializeUploadSystem();
    
    // Initialize file handling
    initializeFileHandling();
    
    // Load recent uploads
    loadRecentUploads();
});

function initializeUploadSystem() {
    // File input handling
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const submitBtn = document.getElementById('submitUpload');
    const encryptBtn = document.getElementById('encryptUpload');
    const cancelBtn = document.getElementById('cancelUpload');
    
    // Submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', submitUpload);
    }
    
    // Encrypt & submit button
    if (encryptBtn) {
        encryptBtn.addEventListener('click', encryptAndSubmit);
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelUpload);
    }
    
    // Drag and drop events
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#cc9900';
            this.style.background = '#222';
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#666';
            this.style.background = '';
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#666';
            this.style.background = '';
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFiles(this.files);
        });
    }
    
    // Form validation
    setupFormValidation();
}

function initializeFileHandling() {
    // Create file list container if it doesn't exist
    const fileList = document.getElementById('fileList');
    if (!fileList) {
        const container = document.createElement('div');
        container.id = 'fileList';
        container.className = 'file-list';
        document.querySelector('.file-upload').appendChild(container);
    }
    
    // Initialize files array
    window.uploadFiles = [];
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    // Clear existing files if starting fresh
    if (window.uploadFiles.length === 0) {
        fileList.innerHTML = '';
    }
    
    // Limit to 5 files total
    if (window.uploadFiles.length + files.length > 5) {
        showUploadNotification('Maximum 5 files allowed', 'error');
        return;
    }
    
    Array.from(files).forEach(file => {
        // Check file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
            showUploadNotification(`${file.name} exceeds 100MB limit`, 'error');
            return;
        }
        
        // Check file type
        const allowedTypes = [
            'text/plain', 'application/pdf', 'image/jpeg', 'image/png',
            'application/msword', 'application/rtf', 'text/rtf',
            'application/zip', 'application/x-zip-compressed'
        ];
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['txt', 'pdf', 'jpg', 'jpeg', 'png', 'doc', 'rtf', 'zip'];
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            showUploadNotification(`${file.name} has unsupported format`, 'error');
            return;
        }
        
        // Add to files array
        window.uploadFiles.push(file);
        
        // Create file item element
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.filename = file.name;
        
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="file-icon">${getFileIcon(file.name)}</span>
                <div>
                    <div class="file-name">${escapeHtml(file.name)}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
                <div class="file-status">Ready</div>
                <button class="remove-file" style="background: #330000; color: #ff6666; border: 1px solid #666; padding: 2px 6px; font-size: 10px; cursor: pointer;">×</button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
        
        // Add remove functionality
        fileItem.querySelector('.remove-file').addEventListener('click', function() {
            const fileName = fileItem.dataset.filename;
            window.uploadFiles = window.uploadFiles.filter(f => f.name !== fileName);
            fileItem.remove();
            showUploadNotification(`Removed: ${fileName}`, 'info');
        });
    });
    
    showUploadNotification(`Added ${files.length} file(s)`, 'success');
}

function submitUpload() {
    // Validate form
    if (!validateUploadForm()) {
        return;
    }
    
    // Validate files
    if (window.uploadFiles.length === 0) {
        showUploadNotification('Please select at least one file', 'error');
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Show processing animation
    showProcessingAnimation();
    
    // Simulate upload process
    simulateUpload(formData);
}

function encryptAndSubmit() {
    // Get encryption level
    const encryptionLevel = document.querySelector('input[name="encryption"]:checked').value;
    
    // Update form to show encryption
    const docDescription = document.getElementById('docDescription');
    const originalDescription = docDescription.value;
    
    if (encryptionLevel === 'enhanced' || encryptionLevel === 'maximum') {
        docDescription.value = `[ENCRYPTED - LEVEL ${encryptionLevel === 'enhanced' ? '4' : '5'}]\n${originalDescription}`;
    }
    
    // Submit the upload
    submitUpload();
    
    showUploadNotification('Encryption applied to upload', 'info');
}

function cancelUpload() {
    if (confirm('Are you sure you want to cancel this upload? All entered data will be lost.')) {
        // Clear form
        document.querySelector('.upload-form').reset();
        
        // Clear file list
        window.uploadFiles = [];
        const fileList = document.getElementById('fileList');
        if (fileList) fileList.innerHTML = '';
        
        // Reset verification checkboxes
        document.querySelectorAll('.verification-checks input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        showUploadNotification('Upload cancelled', 'warning');
    }
}

function simulateUpload(formData) {
    const totalFiles = window.uploadFiles.length;
    let processedFiles = 0;
    
    // Create progress display
    const progressDiv = document.createElement('div');
    progressDiv.id = 'uploadProgress';
    progressDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #0a0a0a;
        border: 2px solid #cc9900;
        padding: 30px;
        z-index: 10001;
        text-align: center;
        min-width: 300px;
    `;
    
    progressDiv.innerHTML = `
        <h3 style="color: #ff9900; margin-top: 0;">UPLOADING FILES</h3>
        <div style="color: #cccccc; margin-bottom: 20px;">${formData.title}</div>
        
        <div style="background: #000; border: 1px solid #333; height: 20px; margin-bottom: 20px;">
            <div id="uploadProgressBar" style="width: 0%; height: 100%; background: #00cc00; transition: width 0.5s;"></div>
        </div>
        
        <div id="uploadStatus" style="color: #999; font-size: 12px; margin-bottom: 20px;">
            Initializing upload...
        </div>
        
        <div id="fileProgress" style="color: #cccccc; font-size: 11px; text-align: left; max-height: 200px; overflow-y: auto; margin-bottom: 20px;"></div>
        
        <button id="cancelUploadProcess" style="background: #330000; color: #ff6666; border: 1px solid #666; padding: 5px 15px; cursor: pointer;">CANCEL</button>
    `;
    
    document.body.appendChild(progressDiv);
    
    // Cancel button
    progressDiv.querySelector('#cancelUploadProcess').addEventListener('click', function() {
        document.body.removeChild(progressDiv);
        showUploadNotification('Upload cancelled by user', 'warning');
    });
    
    // Simulate file upload process
    const fileProgress = progressDiv.querySelector('#fileProgress');
    const progressBar = progressDiv.querySelector('#uploadProgressBar');
    const statusText = progressDiv.querySelector('#uploadStatus');
    
    // Process each file
    window.uploadFiles.forEach((file, index) => {
        setTimeout(() => {
            const fileName = file.name;
            const fileSize = formatFileSize(file.size);
            
            // Update file progress
            const fileItem = document.createElement('div');
            fileItem.style.cssText = 'margin: 5px 0; padding: 5px; background: #111; border: 1px solid #333;';
            fileItem.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <span>${escapeHtml(fileName)}</span>
                    <span id="fileStatus${index}" style="color: #ff9900;">Uploading...</span>
                </div>
                <div style="font-size: 10px; color: #999;">${fileSize}</div>
            `;
            fileProgress.appendChild(fileItem);
            
            // Simulate upload steps
            const steps = [
                { delay: 500, status: 'Encrypting...' },
                { delay: 1000, status: 'Transmitting...' },
                { delay: 800, status: 'Verifying...' },
                { delay: 600, status: 'Archiving...' }
            ];
            
            let stepIndex = 0;
            
            function processStep() {
                if (stepIndex < steps.length) {
                    const step = steps[stepIndex];
                    const statusElement = document.getElementById(`fileStatus${index}`);
                    
                    setTimeout(() => {
                        statusElement.textContent = step.status;
                        statusElement.style.color = stepIndex === steps.length - 1 ? '#00cc00' : '#ff9900';
                        stepIndex++;
                        processStep();
                    }, step.delay);
                } else {
                    processedFiles++;
                    const progress = (processedFiles / totalFiles) * 100;
                    progressBar.style.width = `${progress}%`;
                    
                    statusText.textContent = `Processed ${processedFiles} of ${totalFiles} files`;
                    
                    if (processedFiles === totalFiles) {
                        // Complete upload
                        setTimeout(() => {
                            completeUpload(formData, progressDiv);
                        }, 1000);
                    }
                }
            }
            
            processStep();
        }, index * 500); // Stagger file processing
    });
}

function completeUpload(formData, progressDiv) {
    // Update status
    progressDiv.querySelector('#uploadStatus').textContent = 'Finalizing upload...';
    progressDiv.querySelector('#uploadStatus').style.color = '#00cc00';
    
    // Generate upload ID
    const uploadId = `UPL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Save to localStorage (simulating server storage)
    saveUploadToStorage(formData, uploadId);
    
    // Update recent uploads display
    addToRecentUploads(formData, uploadId);
    
    // Show completion
    setTimeout(() => {
        document.body.removeChild(progressDiv);
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0a0a0a;
            border: 2px solid #00cc00;
            padding: 30px;
            z-index: 10001;
            text-align: center;
            min-width: 300px;
        `;
        
        successDiv.innerHTML = `
            <h3 style="color: #00ff00; margin-top: 0;">✅ UPLOAD SUCCESSFUL</h3>
            <div style="color: #cccccc; margin-bottom: 20px;">
                <strong>${formData.title}</strong><br>
                Upload ID: ${uploadId}
            </div>
            
            <div style="background: #001100; border: 1px solid #00cc00; padding: 15px; margin-bottom: 20px; text-align: left;">
                <div style="color: #00cc00; font-size: 11px; margin-bottom: 5px;">UPLOAD SUMMARY:</div>
                <div style="color: #cccccc; font-size: 12px;">
                    • Files: ${window.uploadFiles.length}<br>
                    • Category: ${formData.category}<br>
                    • Clearance: ${formData.clearance}<br>
                    • Encryption: ${formData.encryption}<br>
                    • Researcher: ${formData.researcherId}
                </div>
            </div>
            
            <div style="color: #999; font-size: 11px; margin-bottom: 20px;">
                Your upload is being processed and will be available in the archive after verification.
            </div>
            
            <button id="closeSuccess" style="background: #003300; color: #00cc00; border: 1px solid #006600; padding: 10px 20px; cursor: pointer;">CONTINUE</button>
        `;
        
        document.body.appendChild(successDiv);
        
        successDiv.querySelector('#closeSuccess').addEventListener('click', function() {
            document.body.removeChild(successDiv);
            
            // Reset form
            cancelUpload();
            
            // Show final notification
            showUploadNotification(`Upload ${uploadId} completed successfully`, 'success');
            
            // Update statistics
            updateUploadStats();
        });
    }, 1500);
}

function saveUploadToStorage(formData, uploadId) {
    const uploads = JSON.parse(localStorage.getItem('archive_uploads') || '[]');
    
    const uploadRecord = {
        id: uploadId,
        ...formData,
        files: window.uploadFiles.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
        })),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    uploads.push(uploadRecord);
    localStorage.setItem('archive_uploads', JSON.stringify(uploads));
}

function addToRecentUploads(formData, uploadId) {
    const uploadsTable = document.querySelector('.uploads-table tbody');
    if (!uploadsTable) return;
    
    const newRow = document.createElement('tr');
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
    const totalSize = window.uploadFiles.reduce((sum, file) => sum + file.size, 0);
    const sizeStr = formatFileSize(totalSize);
    
    newRow.innerHTML = `
        <td>${dateStr}</td>
        <td>${escapeHtml(formData.title)}</td>
        <td>${escapeHtml(formData.researcherId)}</td>
        <td class="status-pending">Pending Review</td>
        <td>${sizeStr}</td>
    `;
    
    // Add to top of table
    uploadsTable.insertBefore(newRow, uploadsTable.firstChild);
    
    // Limit to 10 rows
    while (uploadsTable.children.length > 10) {
        uploadsTable.removeChild(uploadsTable.lastChild);
    }
}

function loadRecentUploads() {
    const uploads = JSON.parse(localStorage.getItem('archive_uploads') || '[]');
    
    // Sort by timestamp (newest first)
    uploads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Take only the 4 most recent for display
    const recent = uploads.slice(0, 4);
    
    // Update the table if it exists
    const uploadsTable = document.querySelector('.uploads-table tbody');
    if (uploadsTable && recent.length > 0) {
        // Clear existing rows (except the default ones if they exist)
        const defaultRows = uploadsTable.querySelectorAll('tr');
        if (defaultRows.length > 4) { // If we have more than the default 4
            uploadsTable.innerHTML = '';
        }
        
        // Add recent uploads
        recent.forEach(upload => {
            const date = new Date(upload.timestamp);
            const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
            const totalSize = upload.files.reduce((sum, file) => sum + file.size, 0);
            const sizeStr = formatFileSize(totalSize);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${escapeHtml(upload.title)}</td>
                <td>${escapeHtml(upload.researcherId)}</td>
                <td class="${upload.status === 'verified' ? 'status-verified' : upload.status === 'processing' ? 'status-processing' : 'status-pending'}">
                    ${upload.status === 'verified' ? 'Verified' : upload.status === 'processing' ? 'Processing' : 'Pending Review'}
                </td>
                <td>${sizeStr}</td>
            `;
            uploadsTable.appendChild(row);
        });
    }
}

function updateUploadStats() {
    const uploads = JSON.parse(localStorage.getItem('archive_uploads') || '[]');
    const totalUploads = uploads.length;
    
    // Calculate total size
    const totalSize = uploads.reduce((sum, upload) => {
        return sum + upload.files.reduce((fileSum, file) => fileSum + file.size, 0);
    }, 0);
    
    const sizeStr = formatFileSize(totalSize);
    
    // Update stats boxes
    const statsBoxes = document.querySelectorAll('.stat-box h4');
    if (statsBoxes.length >= 3) {
        statsBoxes[0].textContent = totalUploads + 2847; // Add to existing archive count
        statsBoxes[1].textContent = sizeStr.split(' ')[0]; // Just the number
        statsBoxes[2].textContent = uploads.filter(u => u.status === 'verified').length;
    }
}

// Helper Functions
function validateUploadForm() {
    const requiredFields = [
        { id: 'docTitle', name: 'Document Title' },
        { id: 'docCategory', name: 'Category' },
        { id: 'docClearance', name: 'Clearance Level' },
        { id: 'docDescription', name: 'Description' },
        { id: 'researcherId', name: 'Researcher ID' }
    ];
    
    // Check verification checkboxes
    const checkboxes = document.querySelectorAll('.verification-checks input[type="checkbox"]');
    let allChecked = true;
    
    checkboxes.forEach(cb => {
        if (!cb.checked) {
            cb.parentElement.style.color = '#ff0000';
            allChecked = false;
        } else {
            cb.parentElement.style.color = '';
        }
    });
    
    if (!allChecked) {
        showUploadNotification('Please confirm all verification checks', 'error');
        return false;
    }
    
    // Check required fields
    let isValid = true;
    let missingFields = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            isValid = false;
            missingFields.push(field.name);
            
            // Highlight missing field
            if (element) {
                element.style.borderColor = '#ff0000';
                element.style.background = '#330000';
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    element.style.borderColor = '';
                    element.style.background = '';
                }, 3000);
            }
        }
    });
    
    if (!isValid) {
        showUploadNotification(`Missing required fields: ${missingFields.join(', ')}`, 'error');
        return false;
    }
    
    return true;
}

function getFormData() {
    return {
        title: document.getElementById('docTitle').value,
        category: document.getElementById('docCategory').value,
        clearance: document.getElementById('docClearance').value,
        description: document.getElementById('docDescription').value,
        source: document.getElementById('docSource').value,
        encryption: document.querySelector('input[name="encryption"]:checked').value,
        notes: document.getElementById('docNotes').value,
        researcherId: document.getElementById('researcherId').value,
        uploaderClearance: document.getElementById('uploaderClearance').value,
        uploadPurpose: document.getElementById('uploadPurpose').value
    };
}

function setupFormValidation() {
    // Real-time validation for fields
    const fields = document.querySelectorAll('input[required], textarea[required], select[required]');
    
    fields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#00cc00';
                this.style.background = '#001100';
            } else {
                this.style.borderColor = '';
                this.style.background = '';
            }
        });
        
        field.addEventListener('blur', function() {
            if (!this.value.trim() && this.hasAttribute('required')) {
                this.style.borderColor = '#ff0000';
                this.style.background = '#330000';
            }
        });
    });
}

function showProcessingAnimation() {
    // Add processing overlay
    const overlay = document.createElement('div');
    overlay.id = 'processingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: #ff9900;">
            <div style="font-size: 24px; margin-bottom: 20px;">🔒</div>
            <div style="font-family: monospace; font-size: 14px;">INITIALIZING UPLOAD PROTOCOL...</div>
            <div style="margin-top: 20px; font-size: 11px; color: #999;">Applying Nabazov encryption cipher</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    }, 2000);
}

function showUploadNotification(message, type = 'info') {
    const colors = {
        success: { bg: '#003300', border: '#00cc00', text: '#00ff00' },
        error: { bg: '#330000', border: '#ff0000', text: '#ff6666' },
        info: { bg: '#000033', border: '#0066ff', text: '#6699ff' },
        warning: { bg: '#663300', border: '#ff9900', text: '#ffcc00' }
    };
    
    const color = colors[type] || colors.info;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        padding: 10px 20px;
        z-index: 10001;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animations if needed
    if (!document.querySelector('#upload-animations')) {
        const style = document.createElement('style');
        style.id = 'upload-animations';
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
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    const icons = {
        'txt': '📄',
        'pdf': '📕',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'doc': '📘',
        'rtf': '📘',
        'zip': '📦'
    };
    
    return icons[ext] || '📎';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}