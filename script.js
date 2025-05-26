document.addEventListener('DOMContentLoaded', () => {
    window.jsPDF = window.jspdf.jsPDF;

    // --- DOM Elements ---
    // Personal Details
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const profilePicPreviewContainer = document.getElementById('profilePicPreviewContainer');
    const removeProfilePicBtn = document.getElementById('removeProfilePic');
    const resumeProfilePic = document.getElementById('resumeProfilePic');

    const inputs = {
        fullName: document.getElementById('fullName'),
        jobTitle: document.getElementById('jobTitle'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        linkedin: document.getElementById('linkedin'),
        portfolio: document.getElementById('portfolio'),
        summary: document.getElementById('summary')
    };

    const previews = {
        fullName: document.getElementById('previewFullName'),
        jobTitle: document.getElementById('previewJobTitle'),
        email: document.getElementById('previewEmail'),
        phone: document.getElementById('previewPhone'),
        address: document.getElementById('previewAddress'),
        linkedin: document.getElementById('previewLinkedIn'),
        portfolio: document.getElementById('previewPortfolio'),
        summary: document.getElementById('previewSummary')
    };

    const sectionPlaceholders = {
        experience: previewExperience.querySelector('.placeholder-text'),
        education: previewEducation.querySelector('.placeholder-text'),
        projects: previewProjects.querySelector('.placeholder-text'),
        skills: previewSkills.querySelector('.placeholder-text'),
        languages: previewLanguages.querySelector('.placeholder-text'),
    };


    // Dynamic Section Containers & Add Buttons
    const dynamicSections = {
        experience: {
            container: document.getElementById('experienceContainer'),
            addBtn: document.getElementById('addExperienceBtn'),
            previewContainer: document.getElementById('previewExperience'),
            count: 0,
            fields: [{
                    id: 'JobTitle',
                    label: 'Job Title',
                    placeholder: 'e.g., Senior Developer'
                },
                {
                    id: 'Company',
                    label: 'Company',
                    placeholder: 'e.g., Tech Solutions Inc.'
                },
                {
                    id: 'Location',
                    label: 'Location',
                    placeholder: 'e.g., San Francisco, CA'
                },
                {
                    id: 'StartDate',
                    label: 'Start Date',
                    placeholder: 'e.g., Jan 2020'
                },
                {
                    id: 'EndDate',
                    label: 'End Date',
                    placeholder: "e.g., Dec 2022 or Present"
                },
                {
                    id: 'Description',
                    label: 'Responsibilities/Achievements',
                    type: 'textarea',
                    placeholder: "Describe your role (use '-' or '*' for bullet points)"
                }
            ],
            previewFn: updateExperiencePreview
        },
        education: {
            container: document.getElementById('educationContainer'),
            addBtn: document.getElementById('addEducationBtn'),
            previewContainer: document.getElementById('previewEducation'),
            count: 0,
            fields: [{
                    id: 'Degree',
                    label: 'Degree/Certificate',
                    placeholder: 'e.g., B.Sc. Computer Science'
                },
                {
                    id: 'Institution',
                    label: 'Institution',
                    placeholder: 'e.g., University of Example'
                },
                {
                    id: 'GradYear',
                    label: 'Graduation Year/Expected',
                    placeholder: 'e.g., 2019 or Expected May 2025'
                },
                {
                    id: 'Description',
                    label: 'Details/Honors (Optional)',
                    type: 'textarea',
                    placeholder: "e.g., Dean's List, Relevant Coursework"
                }
            ],
            previewFn: updateEducationPreview
        },
        projects: {
            container: document.getElementById('projectsContainer'),
            addBtn: document.getElementById('addProjectBtn'),
            previewContainer: document.getElementById('previewProjects'),
            count: 0,
            fields: [{
                    id: 'Name',
                    label: 'Project Name',
                    placeholder: 'e.g., Personal Portfolio Website'
                },
                {
                    id: 'Link',
                    label: 'Project Link (Optional)',
                    placeholder: 'e.g., github.com/yourproject'
                },
                {
                    id: 'Description',
                    label: 'Description',
                    type: 'textarea',
                    placeholder: "Describe the project, your role, and technologies used."
                }
            ],
            previewFn: updateProjectsPreview
        },
        skills: { // Single entry per click, for list-like input
            container: document.getElementById('skillsContainer'),
            addBtn: document.getElementById('addSkillBtn'),
            previewContainer: document.getElementById('previewSkills'),
            count: 0,
            fields: [{
                id: 'Name',
                label: 'Skill',
                placeholder: 'e.g., JavaScript'
            }],
            previewFn: updateSkillsPreview
        },
        languages: {
            container: document.getElementById('languagesContainer'),
            addBtn: document.getElementById('addLanguageBtn'),
            previewContainer: document.getElementById('previewLanguages'),
            count: 0,
            fields: [{
                    id: 'Name',
                    label: 'Language',
                    placeholder: 'e.g., English'
                },
                {
                    id: 'Proficiency',
                    label: 'Proficiency',
                    placeholder: 'e.g., Native, Fluent, Conversational'
                }
            ],
            previewFn: updateLanguagesPreview
        }
    };

    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const templatesBtn = document.getElementById('templatesBtn');
    const templatesDropdown = document.getElementById('templatesDropdown');

    // --- Event Listeners ---

    // Personal Details & Summary Input
    Object.keys(inputs).forEach(key => {
        if (inputs[key]) {
            inputs[key].addEventListener('input', () => {
                updatePersonalDetailPreview(key);
                updateAllDynamicPreviews(); // For any linked updates
            });
        }
    });

    function updatePersonalDetailPreview(key) {
        const value = inputs[key].value;
        const previewEl = previews[key];
        if (!previewEl) return;

        let iconHtml = '';
        const iconMap = {
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            address: 'fas fa-map-marker-alt',
            linkedin: 'fab fa-linkedin',
            portfolio: 'fas fa-globe'
        };

        if (iconMap[key]) {
            iconHtml = `<i class="${iconMap[key]}"></i> `;
        }

        if (value) {
            if (key === 'linkedin' || key === 'portfolio') {
                let href = value;
                if (!value.startsWith('http://') && !value.startsWith('https://')) {
                    href = 'https://' + value;
                }
                previewEl.innerHTML = `${iconHtml}<a href="${href}" target="_blank">${value}</a>`;
            } else {
                previewEl.innerHTML = `${iconHtml}${value}`;
            }
            previewEl.style.display = (key === 'fullName' || key === 'jobTitle' || key === 'summary') ? 'block' : 'inline-block';
            if (key === 'summary' && value.trim() === '') {
                previewEl.innerHTML = getDefaultPreviewText(key); // Show placeholder if empty
            } else if (key === 'summary') {
                previewEl.innerHTML = value.replace(/\n/g, '<br>'); // Preserve newlines for summary
            }
        } else {
            // For contact info, hide if empty. For Name/Title/Summary, show placeholder.
            if (key === 'fullName' || key === 'jobTitle' || key === 'summary') {
                previewEl.textContent = getDefaultPreviewText(key);
            } else {
                previewEl.style.display = 'none';
            }
        }
    }

    function getDefaultPreviewText(key) {
        const defaults = {
            fullName: 'Your Name',
            jobTitle: 'Your Profession',
            summary: 'Enter your professional summary here.',
            // Other fields typically hidden if empty
        };
        return defaults[key] || '';
    }

    // Profile Picture
    profilePicInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicPreview.src = e.target.result;
                resumeProfilePic.src = e.target.result;
                profilePicPreviewContainer.style.display = 'block';
                resumeProfilePic.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    removeProfilePicBtn.addEventListener('click', () => {
        profilePicInput.value = ''; // Clear the file input
        profilePicPreview.src = '#';
        resumeProfilePic.src = '#';
        profilePicPreviewContainer.style.display = 'none';
        resumeProfilePic.style.display = 'none';
    });

    // Dynamic Section Add Buttons
    Object.keys(dynamicSections).forEach(sectionKey => {
        const section = dynamicSections[sectionKey];
        if (section.addBtn) {
            section.addBtn.addEventListener('click', () => addDynamicEntry(sectionKey));
        }
    });

    function addDynamicEntry(sectionKey) {
        const section = dynamicSections[sectionKey];
        section.count++;
        const entryId = `${sectionKey}${section.count}`;
        const div = document.createElement('div');
        div.classList.add('dynamic-entry');
        div.id = `entry-${entryId}`;

        let fieldsHtml = `<button type="button" class="btn-remove-entry" data-entry-id="${entryId}" data-section-key="${sectionKey}"><i class="fas fa-times-circle"></i></button>`;
        section.fields.forEach(field => {
            const inputId = `${field.id.toLowerCase()}${entryId}`;
            fieldsHtml += `
                <div class="form-group">
                    <label for="${inputId}">${field.label}</label>
                    ${field.type === 'textarea' ? 
                        `<textarea id="${inputId}" rows="3" placeholder="${field.placeholder || ''}"></textarea>` :
                        `<input type="text" id="${inputId}" placeholder="${field.placeholder || ''}">`
                    }
                </div>
            `;
        });
        div.innerHTML = fieldsHtml;
        section.container.appendChild(div);

        // Add input listeners for real-time update
        section.fields.forEach(field => {
            const inputId = `${field.id.toLowerCase()}${entryId}`;
            document.getElementById(inputId).addEventListener('input', section.previewFn);
        });
        div.querySelector('.btn-remove-entry').addEventListener('click', (e) => {
            const targetEntryId = e.currentTarget.dataset.entryId; // Correctly get the entryId for removal
            const targetSectionKey = e.currentTarget.dataset.sectionKey;
            removeDynamicEntry(targetEntryId, targetSectionKey);
        });
        section.previewFn(); // Update preview after adding
    }

    function removeDynamicEntry(entryId, sectionKey) {
        const entryElement = document.getElementById(`entry-${entryId}`);
        if (entryElement) {
            entryElement.remove();
            dynamicSections[sectionKey].previewFn(); // Update the specific preview
        }
    }

    // --- Preview Update Functions ---
    function updateExperiencePreview() {
        const section = dynamicSections.experience;
        section.previewContainer.innerHTML = '';
        let itemCount = 0;
        section.container.querySelectorAll('.dynamic-entry').forEach(entry => {
            const idSuffix = entry.id.split('-')[1]; // e.g., exp1
            const jobTitle = document.getElementById(`jobtitle${idSuffix}`)?.value || '';
            const company = document.getElementById(`company${idSuffix}`)?.value || '';
            const location = document.getElementById(`location${idSuffix}`)?.value || '';
            const startDate = document.getElementById(`startdate${idSuffix}`)?.value || '';
            const endDate = document.getElementById(`enddate${idSuffix}`)?.value || '';
            const description = document.getElementById(`description${idSuffix}`)?.value || '';

            if (jobTitle || company) {
                itemCount++;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('experience-item');
                let dateLocationHtml = '';
                if (startDate || endDate) dateLocationHtml += `${startDate} - ${endDate}`;
                if (location) dateLocationHtml += (dateLocationHtml ? ` | ${location}` : location);

                itemDiv.innerHTML = `
                    <h3 class="item-header">${jobTitle || 'Job Title'}</h3>
                    <div class="item-subheader">
                        <span>${company || 'Company Name'}</span>
                        <span class="date-location">${dateLocationHtml}</span>
                    </div>
                    <div class="item-description">${formatTextWithLists(description)}</div>
                `;
                section.previewContainer.appendChild(itemDiv);
            }
        });
        togglePlaceholder(section.previewContainer, itemCount, 'experience');
    }

    function updateEducationPreview() {
        const section = dynamicSections.education;
        section.previewContainer.innerHTML = '';
        let itemCount = 0;
        section.container.querySelectorAll('.dynamic-entry').forEach(entry => {
            const idSuffix = entry.id.split('-')[1];
            const degree = document.getElementById(`degree${idSuffix}`)?.value || '';
            const institution = document.getElementById(`institution${idSuffix}`)?.value || '';
            const gradYear = document.getElementById(`gradyear${idSuffix}`)?.value || '';
            const description = document.getElementById(`description${idSuffix}`)?.value || '';

            if (degree || institution) {
                itemCount++;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('education-item');
                let instYearHtml = '';
                if (institution) instYearHtml += institution;
                if (gradYear) instYearHtml += (instYearHtml ? ` - ${gradYear}` : gradYear);

                itemDiv.innerHTML = `
                    <h3 class="item-header">${degree || 'Degree/Certificate'}</h3>
                    <div class="item-subheader">
                        <span>${instYearHtml || 'Institution - Year'}</span>
                    </div>
                    ${description ? `<div class="item-description">${formatTextWithLists(description)}</div>` : ''}
                `;
                section.previewContainer.appendChild(itemDiv);
            }
        });
        togglePlaceholder(section.previewContainer, itemCount, 'education');
    }

    function updateProjectsPreview() {
        const section = dynamicSections.projects;
        section.previewContainer.innerHTML = '';
        let itemCount = 0;
        section.container.querySelectorAll('.dynamic-entry').forEach(entry => {
            const idSuffix = entry.id.split('-')[1];
            const name = document.getElementById(`name${idSuffix}`)?.value || '';
            let link = document.getElementById(`link${idSuffix}`)?.value || '';
            const description = document.getElementById(`description${idSuffix}`)?.value || '';

            if (name) {
                itemCount++;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('project-item');

                let linkHtml = '';
                if (link) {
                    if (!link.startsWith('http://') && !link.startsWith('https://')) {
                        link = 'https://' + link;
                    }
                    linkHtml = `<a href="${link}" target="_blank">${link.replace(/^https?:\/\//, '')}</a>`;
                }

                itemDiv.innerHTML = `
                    <h3 class="item-header">${name || 'Project Name'}</h3>
                    ${linkHtml ? `<div class="item-subheader"><span>${linkHtml}</span></div>` : ''}
                    <div class="item-description">${formatTextWithLists(description)}</div>
                `;
                section.previewContainer.appendChild(itemDiv);
            }
        });
        togglePlaceholder(section.previewContainer, itemCount, 'projects');
    }

    function updateSkillsPreview() {
        const section = dynamicSections.skills;
        section.previewContainer.innerHTML = ''; // It's a UL
        let itemCount = 0;
        section.container.querySelectorAll('.dynamic-entry').forEach(entry => {
            const idSuffix = entry.id.split('-')[1];
            const skillName = document.getElementById(`name${idSuffix}`)?.value;
            if (skillName) {
                itemCount++;
                const li = document.createElement('li');
                li.textContent = skillName;
                section.previewContainer.appendChild(li);
            }
        });
        togglePlaceholder(section.previewContainer, itemCount, 'skills', true); // isList = true
    }

    function updateLanguagesPreview() {
        const section = dynamicSections.languages;
        section.previewContainer.innerHTML = ''; // It's a UL
        let itemCount = 0;
        section.container.querySelectorAll('.dynamic-entry').forEach(entry => {
            const idSuffix = entry.id.split('-')[1];
            const name = document.getElementById(`name${idSuffix}`)?.value;
            const proficiency = document.getElementById(`proficiency${idSuffix}`)?.value;
            if (name) {
                itemCount++;
                const li = document.createElement('li');
                li.textContent = `${name}${proficiency ? ` (${proficiency})` : ''}`;
                section.previewContainer.appendChild(li);
            }
        });
        togglePlaceholder(section.previewContainer, itemCount, 'languages', true); // isList = true
    }

    function togglePlaceholder(container, itemCount, sectionKey, isList = false) {
        const placeholder = sectionPlaceholders[sectionKey];
        if (!placeholder) return;

        if (itemCount > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = isList ? 'list-item' : 'block';
            // If it's a list and the container is the UL itself,
            // we need to ensure the placeholder is the only child or that it's part of the flow.
            // For simplicity, the placeholder is an li itself or a p tag.
            if (isList && container.children.length === 0) container.appendChild(placeholder);
            else if (!isList && container.children.length === 0) container.appendChild(placeholder);

        }
    }


    function formatTextWithLists(text) {
        if (!text) return '';
        const lines = text.split('\n');
        let html = '';
        let inList = false;
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${trimmedLine.substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                if (trimmedLine) { // Only add non-empty lines as paragraphs
                    html += `<p>${trimmedLine}</p>`;
                }
            }
        });
        if (inList) {
            html += '</ul>';
        }
        return html;
    }

    function updateAllDynamicPreviews() {
        Object.values(dynamicSections).forEach(section => section.previewFn());
    }


    // Clear All Button
    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all fields? This action cannot be undone.")) {
            // Clear personal details
            Object.values(inputs).forEach(input => input.value = '');
            profilePicInput.value = '';
            removeProfilePicBtn.click(); // Trigger pic removal logic

            // Clear dynamic sections
            Object.keys(dynamicSections).forEach(sectionKey => {
                dynamicSections[sectionKey].container.innerHTML = '';
                dynamicSections[sectionKey].count = 0; // Reset counter
            });

            // Update all previews
            Object.keys(previews).forEach(key => updatePersonalDetailPreview(key));
            updateAllDynamicPreviews();
        }
    });

    // Template Switcher (Visual Only for now)
    templatesDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const templateName = e.target.dataset.template;
            const resumePreviewDiv = document.getElementById('resumePreview');

            // Remove old template classes
            resumePreviewDiv.classList.remove('modern-template', 'classic-template', 'creative-template');
            // Add new template class
            resumePreviewDiv.classList.add(`${templateName}-template`);

            templatesBtn.innerHTML = `<i class="fas fa-palette"></i> ${e.target.textContent.replace(' (Current)','').replace(' (Coming Soon)','')} <i class="fas fa-caret-down" style="font-size:0.8em; margin-left: 5px;"></i>`;

            // Close dropdown (optional, as hover out will do it)
            // templatesDropdown.style.display = 'none'; 
            // setTimeout(() => templatesDropdown.style.display = '', 50); // Allow hover out to work

            if (templateName !== "modern") {
                alert(templateName.charAt(0).toUpperCase() + templateName.slice(1) + " template is a visual placeholder and coming soon!");
            }
        }
    });


    // PDF Download
    downloadPdfBtn.addEventListener('click', () => {
        const resumePreviewElement = document.getElementById('resumePreview');
        const originalStyles = {
            boxShadow: resumePreviewElement.style.boxShadow,
            margin: resumePreviewElement.style.margin
        };
        // Temporarily remove box shadow for cleaner PDF capture
        resumePreviewElement.style.boxShadow = 'none';
        resumePreviewElement.style.margin = '0 auto'; // Ensure it's centered if it wasn't

        // Ensure all contact info with values are displayed for PDF
        Object.keys(previews).forEach(key => {
            if (inputs[key] && inputs[key].value && previews[key].style.display === 'none') {
                previews[key].style.display = (key === 'fullName' || key === 'jobTitle' || key === 'summary') ? 'block' : 'inline-block';
            }
        });
        if (resumeProfilePic.src && resumeProfilePic.src !== window.location.href + "#") { // Check if src is not just '#'
            resumeProfilePic.style.display = 'block';
        }


        html2canvas(resumePreviewElement, {
            scale: 2.5, // Increased scale for better quality
            useCORS: true,
            logging: false, // reduce console noise
            width: resumePreviewElement.offsetWidth, // Use actual width
            height: resumePreviewElement.offsetHeight, // Use actual height
            windowWidth: resumePreviewElement.scrollWidth,
            windowHeight: resumePreviewElement.scrollHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png', 1.0); // Max quality PNG
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Maintain aspect ratio
            const ratio = Math.min(pdfWidth / (canvasWidth / (96 / 72)), pdfHeight / (canvasHeight / (96 / 72))); // Adjust for DPI differences
            // PDF uses 72 DPI, html2canvas often relates to screen DPI (e.g. 96)
            // The division by (96/72) or similar factor might be needed if scaling is off.
            // Simpler:
            const imgProps = pdf.getImageProperties(imgData);
            const newImgWidth = pdfWidth; // Fit to width
            const newImgHeight = (imgProps.height * newImgWidth) / imgProps.width;

            let finalHeight = newImgHeight;
            let position = 0;

            if (newImgHeight <= pdfHeight) {
                pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, newImgHeight);
            } else { // Content is longer than one page
                let remainingHeight = newImgHeight;
                while (remainingHeight > 0) {
                    pdf.addImage(imgData, 'PNG', 0, position, newImgWidth, newImgHeight);
                    remainingHeight -= pdfHeight;
                    position -= pdfHeight; // This is the y-offset for the image on subsequent pages
                    if (remainingHeight > 0) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save(`${inputs.fullName.value || 'resume'}_ProResume.pdf`);

            // Restore original styles
            resumePreviewElement.style.boxShadow = originalStyles.boxShadow;
            resumePreviewElement.style.margin = originalStyles.margin;
            // Restore web view display for contact info
            Object.keys(previews).forEach(key => updatePersonalDetailPreview(key));


        }).catch(err => {
            console.error("Error generating PDF:", err);
            alert("Sorry, an error occurred while generating the PDF. Check console for details.");
            // Restore original styles even on error
            resumePreviewElement.style.boxShadow = originalStyles.boxShadow;
            resumePreviewElement.style.margin = originalStyles.margin;
        });
    });

    // --- Initial Setup ---
    // Add one entry of each dynamic type to start with (optional, or based on user preference)
    // addDynamicEntry('experience');
    // addDynamicEntry('education');
    // addDynamicEntry('skills');

    // Set initial preview states
    Object.keys(previews).forEach(key => updatePersonalDetailPreview(key));
    updateAllDynamicPreviews();
    // Ensure placeholders are visible initially
    Object.keys(sectionPlaceholders).forEach(key => {
        const section = dynamicSections[key];
        const isList = (key === 'skills' || key === 'languages');
        if (section) { // projects and languages are new
            togglePlaceholder(section.previewContainer, 0, key, isList);
        } else if (sectionPlaceholders[key]) { // For older sections not in dynamicSections initially
            sectionPlaceholders[key].style.display = isList ? 'list-item' : 'block';
        }
    });
    // Ensure the main sections are visible initially if they have placeholders
    document.querySelectorAll('.resume-section').forEach(sec => {
        const previewContent = sec.querySelector('div[id^="preview"], ul[id^="preview"]');
        if (previewContent && previewContent.children.length > 0 && previewContent.querySelector('.placeholder-text')) {
            // Section is visible by default
        }
    });

});
